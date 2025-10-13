import { bigNumberToFloat } from "@utils";
import { RegeneratorContractProps, RegeneratorProps } from "./types";

function parseFromContract(data: RegeneratorContractProps): RegeneratorProps {
  return {
    id: bigNumberToFloat(data.id),
    address: data.regeneratorAddress,
    coordinatesCount: bigNumberToFloat(data.coordinatesCount),
    createdAt: bigNumberToFloat(data.createdAt),
    lastRequestAt: bigNumberToFloat(data.lastRequestAt),
    name: data.name,
    pendingInspection: data.pendingInspection,
    pool: {
      currentEra: bigNumberToFloat(data.pool.currentEra),
      onContractPool: data.pool.onContractPool
    },
    proofPhoto: data.proofPhoto,
    regenerationScore: {
      score: bigNumberToFloat(data.regenerationScore.score)
    },
    totalArea: bigNumberToFloat(data.totalArea),
    totalInspections: bigNumberToFloat(data.totalInspections)
  }
}

export const regeneratorAdapter = {
  parseFromContract
}