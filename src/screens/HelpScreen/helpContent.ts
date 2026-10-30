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
} from "@contracts";
import { SINTROP_CHAIN_PARAMS } from "@services";

export const METAMASK_DOWNLOAD_URL = "https://metamask.io/download/";
export const METAMASK_MANUAL_URL = "https://ipfs.sintrop.com/ipfs/QmStSpPexGVQsLnkimNabGrDbhuAPcmUS5x61r7q5Uvg94";
export const EXPLORER_URL = SINTROP_CHAIN_PARAMS.blockExplorerUrls[0];

/** Website FAQ path for the app language (the site has pt and en). */
export function websiteFaqUrl(language: string) {
  return `https://regenerationcredit.org/${language === "pt" ? "pt" : "en"}/faq`;
}

export interface HelpRow {
  label: string;
  value: string;
}

/** Network data in the shape MetaMask asks for when adding a network by hand. */
export const NETWORK_ROWS: HelpRow[] = [
  { label: "help.networkName", value: SINTROP_CHAIN_PARAMS.chainName },
  { label: "help.rpcUrl", value: SINTROP_CHAIN_PARAMS.rpcUrls[0] },
  { label: "help.chainId", value: String(parseInt(SINTROP_CHAIN_PARAMS.chainId, 16)) },
  { label: "help.currencySymbol", value: SINTROP_CHAIN_PARAMS.nativeCurrency.symbol },
  { label: "help.explorer", value: EXPLORER_URL },
];

/** RegenerationCredit ERC20 metadata, as returned by symbol() and decimals() on-chain. */
export const TOKEN_ROWS: HelpRow[] = [
  { label: "help.tokenAddress", value: RegenerationCredit.address },
  { label: "help.tokenSymbol", value: "RC" },
  { label: "help.tokenDecimals", value: "18" },
];

/** Mainnet addresses from core-contracts/deployed_contracts/mainnet, plus the RC market. */
export const CONTRACT_ROWS: HelpRow[] = [
  { label: "RegenerationCredit", value: RegenerationCredit.address },
  { label: "RegenerationCreditImpact", value: RegenerationCreditImpact.address },
  { label: "CommunityRules", value: CommunityRules.address },
  { label: "InvitationRules", value: InvitationRules.address },
  { label: "InspectionRules", value: InspectionRules.address },
  { label: "RegenerationIndexRules", value: "0xcd42a990B7A2DA6e529a1B89CCc2439b398cbF4A" },
  { label: "RegeneratorRules", value: RegeneratorRules.address },
  { label: "RegeneratorPool", value: RegeneratorPool.address },
  { label: "InspectorRules", value: InspectorRules.address },
  { label: "InspectorPool", value: InspectorPool.address },
  { label: "ResearcherRules", value: ResearcherRules.address },
  { label: "ResearcherPool", value: ResearcherPool.address },
  { label: "DeveloperRules", value: DeveloperRules.address },
  { label: "DeveloperPool", value: DeveloperPool.address },
  { label: "ContributorRules", value: ContributorRules.address },
  { label: "ContributorPool", value: ContributorPool.address },
  { label: "ActivistRules", value: ActivistRules.address },
  { label: "ActivistPool", value: ActivistPool.address },
  { label: "SupporterRules", value: SupporterRules.address },
  { label: "ValidationRules", value: ValidationRules.address },
  { label: "ValidationPool", value: "0xA9E14EefACeb8b9E83592F6BC692BfdAA6F7f1F1" },
  { label: "VoteRules", value: VoteRules.address },
  { label: "RCMarket", value: RCMarket.address },
];

export const STEP_KEYS = ["wallet", "network", "connect", "gas", "register", "earn", "token"] as const;

export const FAQ_KEYS = [
  "whatIs",
  "howEarn",
  "buy",
  "invite",
  "sin",
  "eras",
  "withdraw",
  "inspection",
  "validation",
  "offset",
  "security",
  "rpc",
] as const;
