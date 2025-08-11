import { inspectionService } from "@domain"

async function getListIdsInspections(rpc: string): Promise<number[]> {
  const totalInspections = await inspectionService.getTotalInspections({ rpc })
  console.log(totalInspections)
  const ids = Array.from({ length: totalInspections }, (_, i) => i + 1)
  return ids.reverse();
}

export const feedService = {
  getListIdsInspections
}