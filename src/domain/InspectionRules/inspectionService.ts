import { bigNumberToFloat } from "@utils"
import { InspectionProps } from "@domain";

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

export const inspectionService = {
  getTotalInspections,
  getInspection
}