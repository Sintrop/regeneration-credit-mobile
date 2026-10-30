import { useQuery } from "@tanstack/react-query";
import Web3 from "web3";

import { ContributorRules, DeveloperRules, ResearcherRules, ValidationRules } from "@contracts";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { PublishedResourceType } from "../../Resources/types";

const CONTRACTS: Record<PublishedResourceType, { abi: any; address: string }> = {
  research: ResearcherRules,
  report: DeveloperRules,
  contribution: ContributorRules,
};

async function getVotingContext(rpc: string) {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  const at = (ref: { abi: any; address: string }) => new web3.eth.Contract(ref.abi, ref.address);
  const [votesNeeded, research, report, contribution] = await Promise.all([
    at(ValidationRules).methods.votesToInvalidate().call(),
    at(CONTRACTS.research).methods.poolCurrentEra().call(),
    at(CONTRACTS.report).methods.poolCurrentEra().call(),
    at(CONTRACTS.contribution).methods.poolCurrentEra().call(),
  ]);
  return {
    votesNeeded: Number(votesNeeded),
    currentEra: { research: Number(research), report: Number(report), contribution: Number(contribution) } as Record<PublishedResourceType, number>,
  };
}

/** Votes needed to invalidate and the current era of each resource contract. */
export function useVotingContext() {
  const { rpc } = useSettingsContext();
  const { data } = useQuery({
    queryKey: [QueryKeys.VotingContext],
    queryFn: () => getVotingContext(rpc),
  });
  return data;
}
