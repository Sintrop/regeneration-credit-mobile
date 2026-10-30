import Web3 from "web3";

import {
  ActivistRules,
  ContributorRules,
  DeveloperRules,
  InspectorRules,
  RegenerationCredit,
  RegeneratorRules,
  ResearcherRules,
} from "@contracts";

import { fetchEvents } from "../Feed/events/fetchEvents";
import { poolContracts } from "./poolContract";
import { epochForEra, eraPhase, EraPhase, percentage, tokensForEra, userEraTokens } from "./poolMath";

const WEI = 10 ** 18;
const num = (value: unknown) => Number(String(value ?? 0).replace("n", ""));

const RULES: Record<number, { contract: { abi: any; address: string }; getter: string }> = {
  1: { contract: RegeneratorRules, getter: "getRegenerator" },
  2: { contract: InspectorRules, getter: "getInspector" },
  3: { contract: ResearcherRules, getter: "getResearcher" },
  4: { contract: DeveloperRules, getter: "getDeveloper" },
  5: { contract: ContributorRules, getter: "getContributor" },
  6: { contract: ActivistRules, getter: "getActivist" },
};

function poolInstance(rpc: string, userType: number) {
  const pool = poolContracts[userType];
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  return { web3, pool, contract: new web3.eth.Contract(pool.abi, pool.address) };
}

export interface PoolOverview {
  userType: number;
  totalTokens: number;
  balance: number;
  distributed: number;
  distributedPercentage: number;
  currentEra: number;
  currentEpoch: number;
  tokensPerEra: number;
  blocksToNextEra: number;
}

export async function getPoolOverview(rpc: string, userType: number): Promise<PoolOverview> {
  const { web3, pool, contract } = poolInstance(rpc, userType);
  const rc = new web3.eth.Contract(RegenerationCredit.abi, RegenerationCredit.address);

  const [total, balance, currentEra] = await Promise.all([
    // tokensPerEpoch(0) = totalTokens / 2^0
    contract.methods.tokensPerEpoch(0).call(),
    rc.methods.balanceOf(pool.address).call(),
    contract.methods.currentContractEra().call(),
  ]);
  const era = num(currentEra);
  const blocksToNextEra = num(await contract.methods.nextEraIn(era).call());

  const totalTokens = num(total) / WEI;
  const poolBalance = num(balance) / WEI;
  const distributed = Math.max(0, totalTokens - poolBalance);

  return {
    userType,
    totalTokens,
    balance: poolBalance,
    distributed,
    distributedPercentage: percentage(distributed, totalTokens),
    currentEra: era,
    currentEpoch: epochForEra(era),
    tokensPerEra: tokensForEra(totalTokens, era),
    blocksToNextEra,
  };
}

export interface PoolWithdrawal {
  user: string;
  amount: number;
  blockNumber: number;
}

export interface PoolEraDetails {
  era: number;
  phase: EraPhase;
  tokensToDistribute: number;
  withdrawnTokens: number;
  withdrawnPercentage: number;
  levels: number;
  claimsCount: number;
  withdrawals: PoolWithdrawal[];
}

export async function getPoolEraDetails(rpc: string, userType: number, era: number, currentEra: number, totalTokens: number): Promise<PoolEraDetails> {
  const { pool, contract } = poolInstance(rpc, userType);
  const [eraData, events] = await Promise.all([
    contract.methods.getEra(era).call() as Promise<any>,
    fetchEvents(rpc, pool, "TokensWithdrawn"),
  ]);

  const tokensToDistribute = tokensForEra(totalTokens, era);
  const withdrawnTokens = num(eraData.tokens) / WEI;

  const withdrawals = events
    .filter(event => num(event.returnValues.era) === era)
    .map(event => ({
      user: String(event.returnValues.user),
      amount: num(event.returnValues.amount) / WEI,
      blockNumber: num(event.blockNumber),
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    era,
    phase: eraPhase(era, currentEra),
    tokensToDistribute,
    withdrawnTokens,
    withdrawnPercentage: percentage(withdrawnTokens, tokensToDistribute),
    levels: num(eraData.levels),
    claimsCount: num(eraData.claimsCount),
    withdrawals,
  };
}

export interface PoolUserPosition {
  /** Era the next withdraw() call will process (user.pool.currentEra). */
  userEra: number;
  canWithdraw: boolean;
  /** Estimated RC for userEra, from the user's levels in that era. */
  estimatedTokens: number;
  userLevelsInEra: number;
  eraLevels: number;
  /** Levels earned in the current, still open era. */
  currentEraLevels: number;
  blocksToUserEraEnd: number;
  /** Regenerators need 3 inspections before withdrawing. */
  minimumInspectionsMet: boolean;
  /** Estimated RC across every ended era not yet processed (userEra .. currentEra - 1). */
  pendingTokens: number;
  pendingEras: number;
}

export async function getPoolUserPosition(rpc: string, userType: number, address: string, currentEra: number, totalTokens: number): Promise<PoolUserPosition> {
  const { web3, contract } = poolInstance(rpc, userType);
  const rules = RULES[userType];
  const user = await new web3.eth.Contract(rules.contract.abi, rules.contract.address).methods[rules.getter](address).call() as any;
  const userEra = Math.max(1, num(user?.pool?.currentEra));

  const [userLevels, eraData, currentLevels, blocksToEnd] = await Promise.all([
    contract.methods.eraLevels(userEra, address).call(),
    contract.methods.getEra(userEra).call() as Promise<any>,
    contract.methods.eraLevels(currentEra, address).call(),
    contract.methods.nextEraIn(userEra).call(),
  ]);

  const levels = num(userLevels);
  const totalLevels = num(eraData.levels);

  const pendingEraIds = Array.from({ length: Math.max(0, currentEra - userEra) }, (_, index) => userEra + index);
  const pendingEstimates = await Promise.all(pendingEraIds.map(async era => {
    const [eraUserLevels, eraInfo] = await Promise.all([
      contract.methods.eraLevels(era, address).call(),
      contract.methods.getEra(era).call() as Promise<any>,
    ]);
    return userEraTokens(num(eraUserLevels), num(eraInfo.levels), tokensForEra(totalTokens, era));
  }));

  return {
    userEra,
    canWithdraw: userEra < currentEra,
    estimatedTokens: userEraTokens(levels, totalLevels, tokensForEra(totalTokens, userEra)),
    userLevelsInEra: levels,
    eraLevels: totalLevels,
    currentEraLevels: num(currentLevels),
    blocksToUserEraEnd: Math.max(0, num(blocksToEnd)),
    minimumInspectionsMet: userType !== 1 || num(user?.totalInspections) >= 3,
    pendingTokens: pendingEstimates.reduce((sum, value) => sum + value, 0),
    pendingEras: pendingEraIds.length,
  };
}
