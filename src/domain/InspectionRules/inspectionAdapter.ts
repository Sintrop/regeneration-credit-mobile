import { InspectionContractProps, InspectionProps, InspectionStatus } from "@domain";
import { bigNumberToFloat } from "@utils";

function parseInspection(data: InspectionContractProps): InspectionProps {
  const statusContract = bigNumberToFloat(data.status);
  let status: InspectionStatus = "open";

  switch (true) {
    case statusContract === 0:
      status = "open";
      break;
    case statusContract === 1:
      status = "accepted";
      break;
    case statusContract === 2:
      status = "realized";
      break;
    case statusContract === 3:
      status = "invalidated";
      break;
    default:
      status = "expired";
      break;
  }

  return {
    acceptedAt: bigNumberToFloat(data.acceptedAt),
    biodiversityResult: bigNumberToFloat(data.biodiversityResult),
    createdAt: bigNumberToFloat(data.createdAt),
    id: bigNumberToFloat(data.id),
    inspectedAt: bigNumberToFloat(data.inspectedAt),
    inspectedAtEra: bigNumberToFloat(data.inspectedAtEra),
    inspector: data.inspector,
    invalidatedAt: bigNumberToFloat(data.invalidatedAt),
    justificationReport: data.justificationReport,
    proofPhotos: data.proofPhotos,
    regenerationScore: bigNumberToFloat(data.regenerationScore),
    regenerator: data.regenerator,
    status,
    treesResult: bigNumberToFloat(data.treesResult),
    validationsCount: bigNumberToFloat(data.validationsCount)
  }
}

export const inspectionAdapter = {
  parseInspection
}