import Web3 from "web3";

import { DeveloperRules } from "@contracts";
import { DeveloperContractProps, ReportContractProps } from "./types";
import { bigNumberToFloat } from "@utils";

interface GetDeveloperProps {
  rpc: string;
  address: string;
}
async function getDeveloper({ rpc, address }: GetDeveloperProps): Promise<DeveloperContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(DeveloperRules.abi, DeveloperRules.address);

  const response = await contract.methods.getDeveloper(address).call() as DeveloperContractProps;
  return response;
}

async function reportsTotalCount({ rpc }: { rpc: string }): Promise<number> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(DeveloperRules.abi, DeveloperRules.address);

  const response = await contract.methods.reportsTotalCount().call() as string;
  return bigNumberToFloat(response);
}

interface GetReportProps {
  rpc: string;
  reportId: number;
}
async function getReport({ rpc, reportId }: GetReportProps): Promise<ReportContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(DeveloperRules.abi, DeveloperRules.address);

  const response = await contract.methods.getReport(reportId).call() as ReportContractProps;
  return response;
}

export const developerContract = {
  getDeveloper,
  reportsTotalCount,
  getReport
}