import { bigNumberToFloat } from "@utils";
import { rcImpactContract } from "./rcImpactContract";
import { ImpactPerTokenProps, TotalImpactProps } from "./types";

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

async function getTotalImpact({ rpc }: { rpc: string }): Promise<TotalImpactProps> {
  const trees = await rcImpactContract.totalTreesImpact({ rpc });
  const carbon = await rcImpactContract.totalCarbonImpact({ rpc });
  const bio = await rcImpactContract.totalBiodiversityImpact({ rpc });
  const area = await rcImpactContract.totalAreaImpact({ rpc });

  return {
    area: bigNumberToFloat(area),
    biodivesity: bigNumberToFloat(bio),
    carbon: bigNumberToFloat(carbon),
    trees: bigNumberToFloat(trees)
  }
}

export const rcImpactService = {
  getImpactPerToken,
  getTotalImpact
}