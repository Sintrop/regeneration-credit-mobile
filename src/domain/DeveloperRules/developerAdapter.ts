import { bigNumberToFloat } from "@utils";
import { DeveloperContractProps, DeveloperProps, ReportContractProps, ReportProps } from "./types";

function parseFromContract(data: DeveloperContractProps): DeveloperProps {
  return {
    id: bigNumberToFloat(data.id),
    address: data.developerWallet,
    createdAt: bigNumberToFloat(data.createdAt),
    name: data.name,
    proofPhoto: data.proofPhoto,
    lastPublishedAt: bigNumberToFloat(data.lastPublishedAt),
    totalReports: bigNumberToFloat(data.totalReports),
    pool: {
      level: bigNumberToFloat(data.pool.level),
      currentEra: bigNumberToFloat(data.pool.currentEra),
    },
  }
}

function parseReport(data: ReportContractProps): ReportProps {
  return {
    id: bigNumberToFloat(data.id),
    developer: data.developer,
    createdAtBlockNumber: bigNumberToFloat(data.createdAtBlockNumber),
    report: data.report,
    description: data.description,
    era: bigNumberToFloat(data.era),
    invalidatedAt: bigNumberToFloat(data.invalidatedAt),
    validationsCount: bigNumberToFloat(data.validationsCount),
    valid: data.valid
  }
}
export const developerAdapter = {
  parseFromContract,
  parseReport
}