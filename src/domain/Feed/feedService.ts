import { developerService, inspectionService, researcherService } from "@domain"

async function getListIdsInspections(rpc: string): Promise<number[]> {
  const totalInspections = await inspectionService.getTotalInspections({ rpc })
  const ids = Array.from({ length: totalInspections }, (_, i) => i + 1)
  return ids.reverse();
}

interface ReturnGetTotalResourcesProps {
  inspectionsCount: number;
  reportsCount: number;
  researchesCount: number
}
async function getTotalResources({ rpc }: { rpc: string }): Promise<ReturnGetTotalResourcesProps> {
  const inspectionsCount = await inspectionService.getTotalInspections({ rpc });
  const reportsCount = await developerService.getTotalReports({ rpc });
  const researchesCount = await researcherService.getTotalResearches({ rpc });

  return {
    inspectionsCount,
    reportsCount,
    researchesCount
  }
}

export const feedService = {
  getListIdsInspections,
  getTotalResources
}