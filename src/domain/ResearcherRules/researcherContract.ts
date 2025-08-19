import Web3 from "web3";

import { ResearcherRules } from "@contracts";
import { CalculatorItemContractProps, EvaluationMethodContractProps, ResearchContractProps, ResearcherContractProps } from "./types";

interface GetResearcherProps {
  rpc: string;
  address: string;
}
async function getResearcher({ rpc, address }: GetResearcherProps): Promise<ResearcherContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(ResearcherRules.abi, ResearcherRules.address);

  const response = await contract.methods.getResearcher(address).call() as ResearcherContractProps;
  return response;
}

interface GetResearchProps {
  rpc: string;
  researchId: number;
}
async function getResearch({ rpc, researchId }: GetResearchProps): Promise<ResearchContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(ResearcherRules.abi, ResearcherRules.address);

  const response = await contract.methods.getResearch(researchId).call() as ResearchContractProps;
  return response;
}

interface GetCalculatorItemProps {
  rpc: string;
  itemId: number;
}
async function getCalculatorItem({ rpc, itemId }: GetCalculatorItemProps): Promise<CalculatorItemContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(ResearcherRules.abi, ResearcherRules.address);

  const response = await contract.methods.getCalculatorItem(itemId).call() as CalculatorItemContractProps;
  return response;
}

interface GetEvaluationMethodProps {
  rpc: string;
  methodId: number;
}
async function getEvaluationMethod({ rpc, methodId }: GetEvaluationMethodProps): Promise<EvaluationMethodContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(ResearcherRules.abi, ResearcherRules.address);

  const response = await contract.methods.getEvaluationMethod(methodId).call() as EvaluationMethodContractProps;
  return response;
}


export const researcherContract = {
  getResearcher,
  getResearch,
  getCalculatorItem,
  getEvaluationMethod
}