import { bigNumberToFloat } from "@utils"
import { ImpactPerEraProps, InspectionProps } from "@domain";

import { inspectionContract } from "./inspectionContract"
import { inspectionAdapter } from "./inspectionAdapter";

async function getTotalInspections({ rpc }: { rpc: string }): Promise<number> {
  const response = await inspectionContract.inspectionsTotalCount({ rpc })
  return bigNumberToFloat(response);
}

interface GetInspectionProps {
  rpc: string;
  inspectionId: number;
}
async function getInspection({ rpc, inspectionId }: GetInspectionProps): Promise<InspectionProps> {
  const response = await inspectionContract.getInspection({ rpc, inspectionId })
  return inspectionAdapter.parseInspection(response);
}

interface GetUserInspectionsProps {
  rpc: string;
  address: string;
}
async function getUserInspections({ rpc, address }: GetUserInspectionsProps): Promise<InspectionProps[]> {
  const ids = await inspectionContract.getInspectionsHistory({ rpc, address })

  let inspections: InspectionProps[] = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const inspection = await inspectionContract.getInspection({ rpc, inspectionId: id })
    inspections.push(inspectionAdapter.parseInspection(inspection))
  }

  return inspections
}

interface GetImpactPerEraProps {
  rpc: string;
  era: number;
}
async function getImpactPerEra({ rpc, era }: GetImpactPerEraProps): Promise<ImpactPerEraProps> {
  const response = await inspectionContract.impactPerEra({ rpc, era })
  return inspectionAdapter.parseImpactPerEra(response);
}

export const inspectionService = {
  getTotalInspections,
  getInspection,
  getUserInspections,
  getImpactPerEra
}