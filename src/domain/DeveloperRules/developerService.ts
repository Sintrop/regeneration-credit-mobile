import { developerAdapter } from "./developerAdapter";
import { developerContract } from "./developerContract";
import { DeveloperProps, ReportProps } from "./types";

interface GetDeveloperProps {
  rpc: string;
  address: string;
}
async function getDeveloper({ address, rpc }: GetDeveloperProps): Promise<DeveloperProps> {
  const response = await developerContract.getDeveloper({ address, rpc });
  return developerAdapter.parseFromContract(response);
}

async function getTotalReports({ rpc }: { rpc: string }): Promise<number> {
  const response = await developerContract.reportsTotalCount({ rpc });
  return response;
}

interface GetReportProps {
  rpc: string;
  reportId: number;
}
async function getReport({ reportId, rpc }: GetReportProps): Promise<ReportProps> {
  const response = await developerContract.getReport({ reportId, rpc });
  return developerAdapter.parseReport(response);
}

export const developerService = {
  getDeveloper,
  getTotalReports,
  getReport
}