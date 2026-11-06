import {
  ActivistPool,
  ActivistRules,
  CommunityRules,
  ContributorPool,
  ContributorRules,
  DeveloperPool,
  DeveloperRules,
  InspectionRules,
  InspectorPool,
  InspectorRules,
  InvitationRules,
  RCMarket,
  RegenerationCredit,
  RegenerationCreditImpact,
  RegeneratorPool,
  RegeneratorRules,
  ResearcherPool,
  ResearcherRules,
  SupporterRules,
  ValidationRules,
  VoteRules,
} from "./index";
import RegenerationIndexRulesJson from "./RegenerationIndexRules.json";
import ValidationPoolJson from "./ValidationPool.json";
import natspec from "./natspec.json";

export type ContractGroup = "token" | "community" | "inspection" | "roles" | "pools" | "governance" | "market";

export interface AbiParameter {
  name: string;
  type: string;
  internalType?: string;
  components?: AbiParameter[];
}

export interface AbiFunction {
  type: "function";
  name: string;
  stateMutability: "view" | "pure" | "nonpayable" | "payable";
  inputs: AbiParameter[];
  outputs: AbiParameter[];
}

export interface FunctionDoc {
  notice?: string;
  details?: string;
  params?: Record<string, string>;
  returns?: Record<string, string>;
}

export interface ContractEntry {
  name: string;
  address: string;
  abi: any[];
  group: ContractGroup;
  notice: string;
  docs: Record<string, FunctionDoc>;
}

type NatSpec = Record<string, { notice: string; functions: Record<string, FunctionDoc> }>;

/** Mainnet addresses from core-contracts/deployed_contracts/mainnet, plus the RC market. */
const ENTRIES: [string, { address: string; abi: any[] }, ContractGroup][] = [
  ["RegenerationCredit", RegenerationCredit, "token"],
  ["RegenerationCreditImpact", RegenerationCreditImpact, "token"],
  ["CommunityRules", CommunityRules, "community"],
  ["InvitationRules", InvitationRules, "community"],
  ["InspectionRules", InspectionRules, "inspection"],
  ["RegenerationIndexRules", { abi: RegenerationIndexRulesJson.abi, address: "0xcd42a990B7A2DA6e529a1B89CCc2439b398cbF4A" }, "inspection"],
  ["RegeneratorRules", RegeneratorRules, "roles"],
  ["InspectorRules", InspectorRules, "roles"],
  ["ResearcherRules", ResearcherRules, "roles"],
  ["DeveloperRules", DeveloperRules, "roles"],
  ["ContributorRules", ContributorRules, "roles"],
  ["ActivistRules", ActivistRules, "roles"],
  ["SupporterRules", SupporterRules, "roles"],
  ["RegeneratorPool", RegeneratorPool, "pools"],
  ["InspectorPool", InspectorPool, "pools"],
  ["ResearcherPool", ResearcherPool, "pools"],
  ["DeveloperPool", DeveloperPool, "pools"],
  ["ContributorPool", ContributorPool, "pools"],
  ["ActivistPool", ActivistPool, "pools"],
  ["ValidationPool", { abi: ValidationPoolJson.abi, address: "0xA9E14EefACeb8b9E83592F6BC692BfdAA6F7f1F1" }, "pools"],
  ["ValidationRules", ValidationRules, "governance"],
  ["VoteRules", VoteRules, "governance"],
  ["RCMarket", RCMarket, "market"],
];

export const CONTRACT_GROUPS: ContractGroup[] = ["token", "community", "inspection", "roles", "pools", "governance", "market"];

export const CONTRACT_REGISTRY: ContractEntry[] = ENTRIES.map(([name, contract, group]) => ({
  name,
  address: contract.address,
  abi: contract.abi,
  group,
  notice: (natspec as NatSpec)[name]?.notice ?? "",
  docs: (natspec as NatSpec)[name]?.functions ?? {},
}));

export function getContractEntry(name: string): ContractEntry | undefined {
  return CONTRACT_REGISTRY.find(entry => entry.name === name);
}

export function contractFunctions(entry: ContractEntry): { read: AbiFunction[]; write: AbiFunction[] } {
  const functions = (entry.abi as AbiFunction[])
    .filter(item => item.type === "function")
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    read: functions.filter(fn => fn.stateMutability === "view" || fn.stateMutability === "pure"),
    write: functions.filter(fn => fn.stateMutability === "nonpayable" || fn.stateMutability === "payable"),
  };
}
