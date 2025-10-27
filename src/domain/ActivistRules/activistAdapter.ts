import { bigNumberToFloat } from "@utils";
import { ActivistContractProps, ActivistProps } from "./types";

function parseActivist(data: ActivistContractProps): ActivistProps {
  return {
    id: bigNumberToFloat(data.id),
    name: data.name,
    address: data.activistWallet,
    createdAt: bigNumberToFloat(data.createdAt),
    proofPhoto: data.proofPhoto,
    pool: {
      level: bigNumberToFloat(data.pool.level),
      currentEra: bigNumberToFloat(data.pool.currentEra)
    }
  }
}

export const activistAdapter = {
  parseActivist
}
