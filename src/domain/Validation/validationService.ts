import Web3 from "web3";

import {
  ActivistRules,
  CommunityRules,
  ContributorRules,
  DeveloperRules,
  InspectionRules,
  InspectorRules,
  RegeneratorRules,
  ResearcherRules,
  ValidationRules,
  VoteRules,
} from "@contracts";

import { poolContracts } from "../Pools/poolContract";
import { TargetState, ValidationTarget, VOTER_USER_TYPES, VoterState } from "./voteEligibility";

interface ContractRef {
  abi: any;
  address: string;
}

const RULES_BY_USER_TYPE: Record<number, ContractRef> = {
  1: RegeneratorRules,
  2: InspectorRules,
  3: ResearcherRules,
  4: DeveloperRules,
  5: ContributorRules,
  6: ActivistRules,
};

/** Contract, getter, vote method and vote event for each resource kind. */
const RESOURCE_CONFIG: Record<Exclude<ValidationTarget, "user">, {
  contract: ContractRef;
  getter: string;
  voteMethod: string;
  event: string;
  eraContract: ContractRef;
}> = {
  research: { contract: ResearcherRules, getter: "getResearch", voteMethod: "addResearchValidation", event: "ResearchValidation", eraContract: ResearcherRules },
  report: { contract: DeveloperRules, getter: "getReport", voteMethod: "addReportValidation", event: "ReportValidation", eraContract: DeveloperRules },
  contribution: { contract: ContributorRules, getter: "getContribution", voteMethod: "addContributionValidation", event: "ContributionValidation", eraContract: ContributorRules },
  inspection: { contract: InspectionRules, getter: "getInspection", voteMethod: "addInspectionValidation", event: "InspectionValidation", eraContract: RegeneratorRules },
};

export function getVoteTransaction(target: ValidationTarget, idOrAddress: string | number, justification: string) {
  if (target === "user") {
    return { contract: ValidationRules, method: "addUserValidation", params: [idOrAddress, justification] };
  }
  const config = RESOURCE_CONFIG[target];
  return { contract: config.contract, method: config.voteMethod, params: [idOrAddress, justification] };
}

export interface ValidationStatus {
  target: TargetState;
  votes: number;
  votesNeeded: number;
  /** Blocks until the era of the target ends (when voting closes). */
  blocksToEraEnd: number;
  voter: VoterState;
}

const num = (value: unknown) => Number(String(value ?? 0).replace("n", ""));

interface Params {
  rpc: string;
  target: ValidationTarget;
  /** Resource id, or the user address when target is "user". */
  idOrAddress: string | number;
  voterAddress?: string;
  voterUserType: number;
}

export async function getValidationStatus({ rpc, target, idOrAddress, voterAddress, voterUserType }: Params): Promise<ValidationStatus> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  const at = (ref: ContractRef) => new web3.eth.Contract(ref.abi, ref.address);
  const validation = at(ValidationRules);
  const community = at(CommunityRules);

  let targetState: TargetState;
  let votes: number;
  let eraContract: ContractRef | undefined;
  let readBlocksToEraEnd: () => Promise<unknown> = async () => 0;
  let alreadyVotedCheck: (() => Promise<boolean>) | undefined;

  if (target === "user") {
    const address = String(idOrAddress);
    const [userType, denied] = await Promise.all([
      community.methods.getUser(address).call(),
      community.methods.isDenied(address).call(),
    ]);
    const type = num(userType);
    eraContract = RULES_BY_USER_TYPE[type];
    const currentEra = eraContract ? num(await at(eraContract).methods.poolCurrentEra().call()) : 0;
    const pool = poolContracts[type];
    if (pool) readBlocksToEraEnd = () => at(pool).methods.nextEraIn(currentEra).call();
    const [userVotes, regenerator] = await Promise.all([
      validation.methods.getUserValidations(address, currentEra).call(),
      type === 1 ? at(RegeneratorRules).methods.getRegenerator(address).call() as Promise<any> : Promise.resolve(null),
    ]);
    votes = num(userVotes);
    targetState = {
      target,
      era: currentEra,
      currentEra,
      targetUserType: type,
      targetDenied: Boolean(denied),
      regeneratorInspections: regenerator ? num(regenerator.totalInspections) : undefined,
    };
    alreadyVotedCheck = async () => {
      if (!voterAddress) return false;
      //@ts-ignore
      const events = await validation.getPastEvents("UserValidation", {
        filter: { _validatorAddress: voterAddress, _userAddress: address, _currentEra: currentEra },
        fromBlock: 0,
        toBlock: "latest",
      });
      return events.length > 0;
    };
  } else {
    const config = RESOURCE_CONFIG[target];
    eraContract = config.eraContract;
    readBlocksToEraEnd = () => at(config.eraContract).methods.nextEraIn().call();
    const [resource, currentEra] = await Promise.all([
      at(config.contract).methods[config.getter](idOrAddress).call() as Promise<any>,
      at(config.eraContract).methods.poolCurrentEra().call(),
    ]);
    votes = num(resource.validationsCount);
    targetState = {
      target,
      era: num(target === "inspection" ? resource.inspectedAtEra : resource.era),
      currentEra: num(currentEra),
      valid: resource.valid === undefined ? undefined : Boolean(resource.valid),
      inspectionStatus: target === "inspection" ? num(resource.status) : undefined,
    };
    alreadyVotedCheck = async () => {
      if (!voterAddress) return false;
      //@ts-ignore
      const events = await at(config.contract).getPastEvents(config.event, {
        filter: { _validatorAddress: voterAddress },
        fromBlock: 0,
        toBlock: "latest",
      });
      return events.some((event: any) => num(event.returnValues?._resourceId) === num(idOrAddress));
    };
  }

  const isVoterType = VOTER_USER_TYPES.includes(voterUserType) && !!voterAddress;

  const [votesNeeded, blocksToEraEnd, voterInfo] = await Promise.all([
    validation.methods.votesToInvalidate().call(),
    readBlocksToEraEnd().catch(() => 0),
    isVoterType
      ? Promise.all([
        at(VoteRules).methods.canVote(voterAddress).call(),
        community.methods.isDenied(voterAddress).call(),
        validation.methods.validatorLastVoteAt(voterAddress).call(),
        validation.methods.timeBetweenVotes().call(),
        web3.eth.getBlockNumber(),
        alreadyVotedCheck ? alreadyVotedCheck() : Promise.resolve(false),
      ])
      : Promise.resolve(null),
  ]);

  let voter: VoterState = { userType: voterUserType, denied: false, canVote: false, alreadyVoted: false, blocksToNextVote: 0 };
  if (voterInfo) {
    const [canVote, denied, lastVoteAt, timeBetweenVotes, currentBlock, alreadyVoted] = voterInfo;
    const last = num(lastVoteAt);
    voter = {
      userType: voterUserType,
      canVote: Boolean(canVote),
      denied: Boolean(denied),
      alreadyVoted: Boolean(alreadyVoted),
      // ValidationRules.waitedTimeBetweenVotes: block.number > lastVoteAt + timeBetweenVotes, or never voted
      blocksToNextVote: last > 0 ? Math.max(0, last + num(timeBetweenVotes) - num(currentBlock) + 1) : 0,
    };
  }

  return {
    target: targetState,
    votes,
    votesNeeded: num(votesNeeded),
    blocksToEraEnd: num(blocksToEraEnd),
    voter,
  };
}
