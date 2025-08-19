import { researcherAdapter } from "./researcherAdapter";
import { researcherContract } from "./researcherContract";
import { CalculatorItemProps, ResearcherProps, ResearchProps } from "./types";

interface GetResearcherProps {
  rpc: string;
  address: string;
}
async function getResearcher({ address, rpc }: GetResearcherProps): Promise<ResearcherProps> {
  const response = await researcherContract.getResearcher({ address, rpc });
  return researcherAdapter.parseResearcher(response);
}

interface GetResearchProps {
  rpc: string;
  researchId: number;
}
async function getResearch({ researchId, rpc }: GetResearchProps): Promise<ResearchProps> {
  const response = await researcherContract.getResearch({ researchId, rpc });
  return researcherAdapter.parseResearch(response);
}

interface GetCalculatorItemProps {
  rpc: string;
  itemId: number;
}
async function getCalculatorItem({ itemId, rpc }: GetCalculatorItemProps): Promise<CalculatorItemProps> {
  const response = await researcherContract.getCalculatorItem({ itemId, rpc });
  return researcherAdapter.parseCalculatorItem(response);
}

async function getTotalResearches({ rpc }: { rpc: string }): Promise<number> {
  const response = await researcherContract.researchesTotalCount({ rpc });
  return response;
}

async function getTotalCalculatorItems({ rpc }: { rpc: string }): Promise<number> {
  const response = await researcherContract.calculatorItemsCount({ rpc });
  return response;
}

async function getTotalEvaluationMethods({ rpc }: { rpc: string }): Promise<number> {
  const response = await researcherContract.evaluationMethodsCount({ rpc });
  return response;
}

export const researcherService = {
  getResearcher,
  getResearch,
  getCalculatorItem,
  getTotalCalculatorItems,
  getTotalResearches,
  getTotalEvaluationMethods
}