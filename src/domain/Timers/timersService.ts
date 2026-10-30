import Web3 from "web3";

import {
  ActivistRules,
  CommunityRules,
  ContributorRules,
  DeveloperRules,
  InspectionRules,
  InspectorRules,
  InvitationRules,
  RegeneratorRules,
  ResearcherRules,
  SupporterRules,
  ValidationRules,
  VoteRules,
} from "@contracts";

import { poolContract, poolContracts } from "../Pools/poolContract";
import { TimerInputs } from "./userTimers";

interface ContractRef {
  abi: any;
  address: string;
}

const USER_RULES: Record<number, { contract: ContractRef; getter: string }> = {
  1: { contract: RegeneratorRules, getter: "getRegenerator" },
  2: { contract: InspectorRules, getter: "getInspector" },
  3: { contract: ResearcherRules, getter: "getResearcher" },
  4: { contract: DeveloperRules, getter: "getDeveloper" },
  5: { contract: ContributorRules, getter: "getContributor" },
  6: { contract: ActivistRules, getter: "getActivist" },
  7: { contract: SupporterRules, getter: "getSupporter" },
};

const VOTER_TYPES = [3, 4, 5];
const PUBLISHER_TYPES = [3, 4, 5];
const INVITE_RULES: Record<number, ContractRef | null> = { 3: ResearcherRules, 4: DeveloperRules, 5: ContributorRules, 6: ActivistRules, 7: null };

const num = (value: unknown) => Number(String(value ?? 0).replace("n", ""));

/** Reads every value buildUserTimers needs for the connected user, in parallel. */
export async function getTimerInputs(rpc: string, address: string, userType: number): Promise<TimerInputs> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  const at = (ref: ContractRef) => new web3.eth.Contract(ref.abi, ref.address);
  const rules = USER_RULES[userType];
  if (!rules) return { userType, currentBlock: 0 };

  const [currentBlock, user] = await Promise.all([
    web3.eth.getBlockNumber(),
    at(rules.contract).methods[rules.getter](address).call() as Promise<any>,
  ]);

  const input: TimerInputs = { userType, currentBlock: num(currentBlock) };
  const tasks: Promise<void>[] = [];

  if (userType === 1) {
    const inspection = at(InspectionRules);
    tasks.push((async () => {
      const [allowed, between] = await Promise.all([
        inspection.methods.allowedInitialRequests().call(),
        inspection.methods.timeBetweenInspections().call(),
      ]);
      input.regenerator = {
        totalInspections: num(user.totalInspections),
        lastRequestAt: num(user.lastRequestAt),
        pendingInspection: Boolean(user.pendingInspection),
        allowedInitialRequests: num(allowed),
        timeBetweenInspections: num(between),
        maxInspections: 6,
      };
    })());
  }

  if (userType === 2) {
    const inspection = at(InspectionRules);
    tasks.push((async () => {
      const lastId = num(user.lastInspection);
      const [toExpire, security, blocksToAccept, nextEraIn, last] = await Promise.all([
        inspection.methods.blocksToExpireAcceptedInspection().call(),
        inspection.methods.securityBlocksToValidation().call(),
        at(InspectorRules).methods.BLOCKS_TO_ACCEPT().call(),
        at(RegeneratorRules).methods.nextEraIn().call(),
        lastId > 0 ? inspection.methods.getInspection(lastId).call() as Promise<any> : Promise.resolve(null),
      ]);
      input.inspector = {
        giveUps: num(user.giveUps),
        maxGiveUps: 3,
        lastRealizedAt: num(user.lastRealizedAt),
        blocksToAccept: num(blocksToAccept),
        lastInspection: last ? { status: num(last.status), acceptedAt: num(last.acceptedAt) } : undefined,
        blocksToExpireAcceptedInspection: num(toExpire),
        regeneratorNextEraIn: num(nextEraIn),
        securityBlocksToValidation: num(security),
      };
    })());
  }

  if (PUBLISHER_TYPES.includes(userType)) {
    const contract = at(rules.contract);
    tasks.push((async () => {
      const [between, security, nextEraIn] = await Promise.all([
        contract.methods.timeBetweenWorks().call(),
        contract.methods.securityBlocksToValidation().call(),
        contract.methods.nextEraIn().call(),
      ]);
      input.publisher = {
        timeBetweenWorks: num(between),
        securityBlocksToValidation: num(security),
        nextEraIn: num(nextEraIn),
        lastPublishedAt: num(user.lastPublishedAt),
        lastCalculatorItemAt: num(user.lastCalculatorItemAt),
      };
    })());
  }

  if (VOTER_TYPES.includes(userType)) {
    tasks.push((async () => {
      const validation = at(ValidationRules);
      const [canVote, lastVoteAt, between] = await Promise.all([
        at(VoteRules).methods.canVote(address).call(),
        validation.methods.validatorLastVoteAt(address).call(),
        validation.methods.timeBetweenVotes().call(),
      ]);
      input.voter = { canVote: Boolean(canVote), lastVoteAt: num(lastVoteAt), timeBetweenVotes: num(between) };
    })());
  }

  if (userType in INVITE_RULES) {
    tasks.push((async () => {
      const invitation = at(InvitationRules);
      const inviteRules = INVITE_RULES[userType];
      const [canSendInvite, lastInvite, settings, lastInviteActivist, activistDelay] = await Promise.all([
        inviteRules ? at(inviteRules).methods.canSendInvite(address).call() : Promise.resolve(true),
        invitation.methods.lastInviteBlocks(address).call(),
        at(CommunityRules).methods.getUserTypeSettings(userType).call() as Promise<any>,
        userType === 6 ? invitation.methods.lastInviteActivist(address).call() : Promise.resolve(0),
        userType === 6 ? invitation.methods.ACTIVIST_DELAY_BLOCKS().call() : Promise.resolve(undefined),
      ]);
      input.invitation = {
        canSendInvite: Boolean(canSendInvite),
        lastInviteBlock: num(lastInvite),
        invitationDelayBlocks: num(settings?.invitationDelayBlocks),
        lastInviteActivist: num(lastInviteActivist),
        activistDelayBlocks: activistDelay === undefined ? undefined : num(activistDelay),
      };
    })());
  }

  if (userType >= 1 && userType <= 6 && user?.pool) {
    tasks.push((async () => {
      const userEra = num(user.pool.currentEra);
      const pool = poolContracts[userType];
      const [poolEra, blocksToNextEra] = await Promise.all([
        poolContract.currentContractEra({ rpc, userType }),
        at(pool).methods.nextEraIn(userEra).call(),
      ]);
      input.pool = {
        userEra,
        poolEra,
        blocksToNextEra: num(blocksToNextEra),
        minimumInspectionsMet: userType === 1 ? num(user.totalInspections) >= 3 : undefined,
      };
    })());
  }

  await Promise.all(tasks.map(task => task.catch(() => undefined)));
  return input;
}
