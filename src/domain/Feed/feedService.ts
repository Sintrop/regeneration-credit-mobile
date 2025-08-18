import { inspectionService } from "@domain"

async function getListIdsInspections(rpc: string): Promise<number[]> {
  const totalInspections = await inspectionService.getTotalInspections({ rpc })
  const ids = Array.from({ length: totalInspections }, (_, i) => i + 1)
  return ids.reverse();
}

interface ReturnGetTotalResourcesProps {
  inspectionsCount: number;
}
async function getTotalResources({ rpc }: { rpc: string }): Promise<ReturnGetTotalResourcesProps> {
  const inspectionsCount = await inspectionService.getTotalInspections({ rpc });

  return {
    inspectionsCount
  }
}

export const feedService = {
  getListIdsInspections,
  getTotalResources
}