import { bigNumberToFloat } from "@utils";
import { rcImpactContract } from "./rcImpactContract";
import { ImpactPerTokenProps } from "./types";

async function getImpactPerToken({ rpc }: { rpc: string }): Promise<ImpactPerTokenProps> {
  const trees = await rcImpactContract.treesPerToken({ rpc });
  const carbon = await rcImpactContract.carbonPerToken({ rpc });
  const bio = await rcImpactContract.biodiversityPerToken({ rpc });
  const area = await rcImpactContract.areaPerToken({ rpc });

  return {
    area: bigNumberToFloat(area) / 10 ** 18,
    biodivesity: bigNumberToFloat(bio) / 10 ** 18,
    carbon: bigNumberToFloat(carbon) / 10 ** 18,
    trees: bigNumberToFloat(trees) / 10 ** 18
  }
}

export const rcImpactService = {
  getImpactPerToken
}