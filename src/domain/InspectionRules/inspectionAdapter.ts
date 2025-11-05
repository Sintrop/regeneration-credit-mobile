import Config from 'react-native-config';

import { chainService, ImpactPerEraContractProps, ImpactPerEraProps, InspectionContractProps, InspectionProps, InspectionStatus } from "@domain";
import { bigNumberToFloat } from "@utils";

async function parseInspection({ data, rpc }: { data: InspectionContractProps; rpc: string; }): Promise<InspectionProps> {
  const statusContract = bigNumberToFloat(data.status);
  let status: InspectionStatus = "open";

  const blocksToExpire = parseInt(Config.BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION);
  const acceptedAt = bigNumberToFloat(data.acceptedAt);
  const currentBlock = await chainService.getBlockNumber({ rpc });

  if (statusContract === 0) {
    status = "open";
  }
  if (statusContract === 1) {
    if (acceptedAt + blocksToExpire < currentBlock) {
      status = "expired";
    } else {
      status = "accepted";
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