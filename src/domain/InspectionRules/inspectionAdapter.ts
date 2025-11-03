import { chainService, ImpactPerEraContractProps, ImpactPerEraProps, InspectionContractProps, InspectionProps, InspectionStatus } from "@domain";
import { bigNumberToFloat } from "@utils";

async function parseInspection({ data, rpc }: { data: InspectionContractProps; rpc: string; }): Promise<InspectionProps> {
  const statusContract = bigNumberToFloat(data.status);
  let status: InspectionStatus = "open";

  const blocksToExpire = parseInt(process.env.VITE_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION as string);
  const createdAt = bigNumberToFloat(data.createdAt);
  const currentBlock = await chainService.getBlockNumber({ rpc });

  if (statusContract === 0) {
    status = "open";
  }
  if (statusContract === 1) {
    status = "accepted";
    if (createdAt + blocksToExpire > currentBlock) {
      status = "accepted";
    } else {
      status = "expired";
    }
  }
  if (statusContract === 2) {
    status = "realized";
  }
  if (statusContract === 3) {
    status = "invalidated";
  }

  return {
    acceptedAt: bigNumberToFloat(data.acceptedAt),
    biodiversityResult: bigNumberToFloat(data.biodiversityResult),
    createdAt: bigNumberToFloat(data.createdAt),
    id: bigNumberToFloat(data.id),
    inspectedAt: bigNumberToFloat(data.inspectedAt),
    inspectedAtEra: bigNumberToFloat(data.inspectedAtEra),
    inspector: data.inspector,
    invalidatedAt: bigNumberToFloat(data.invalidatedAt),
    justificationReport: data.justificationReport,
    proofPhotos: data.proofPhotos,
    regenerationScore: bigNumberToFloat(data.regenerationScore),
    regenerator: data.regenerator,
    status,
    treesResult: bigNumberToFloat(data.treesResult),
    validationsCount: bigNumberToFloat(data.validationsCount)
  }
}

function parseImpactPerEra(data: ImpactPerEraContractProps): ImpactPerEraProps {
  return {
    totalBiodiversity: bigNumberToFloat(data.biodiversity),
    totalInspections: bigNumberToFloat(data.realizedInspections),
    totalTress: bigNumberToFloat(data.trees),
  }
}

export const inspectionAdapter = {
  parseInspection,
  parseImpactPerEra
}