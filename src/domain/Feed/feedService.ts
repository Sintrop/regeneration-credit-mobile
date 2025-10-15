import { contributorService, developerService, inspectionService, researcherService } from "@domain"

async function getListIdsInspections(rpc: string): Promise<number[]> {
  const totalInspections = await inspectionService.getTotalInspections({ rpc })
  const ids = Array.from({ length: totalInspections }, (_, i) => i + 1)
  return ids.reverse();
}

interface ReturnGetTotalResourcesProps {
  inspectionsCount: number;
  reportsCount: number;
  researchesCount: number;
  contributionsCount: number;
}
async function getTotalResources({ rpc }: { rpc: string }): Promise<ReturnGetTotalResourcesProps> {
  const inspectionsCount = await inspectionService.getTotalInspections({ rpc });
  const reportsCount = await developerService.getTotalReports({ rpc });
  const researchesCount = await researcherService.getTotalResearches({ rpc });
  const contributionsCount = await contributorService.getTotalContributions({ rpc });

  return {
    inspectionsCount,
    reportsCount,
    researchesCount,
    contributionsCount
  }
}

export const feedService = {
  getListIdsInspections,
  getTotalResources
}