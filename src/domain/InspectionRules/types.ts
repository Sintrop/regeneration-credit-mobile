export interface InspectionContractProps {
  id: string;
  regenerator: string;
  inspector: string;
  treesResult: string;
  biodiversityResult: string;
  regenerationScore: string;
  proofPhotos: string;
  justificationReport: string;
  validationsCount: string;
  createdAt: string;
  acceptedAt: string;
  inspectedAt: string;
  inspectedAtEra: string;
  invalidatedAt: string;
  status: string;
}

export type InspectionStatus = "open" | "accepted" | "realized" | "invalidated" | "expired";
export interface InspectionProps {
  id: number;
  regenerator: string;
  inspector: string;
  treesResult: number;
  biodiversityResult: number;
  regenerationScore: number;
  proofPhotos: string;
  justificationReport: string;
  validationsCount: number;
  createdAt: number;
  acceptedAt: number;
  inspectedAt: number;
  inspectedAtEra: number;
  invalidatedAt: number;
  status: InspectionStatus;
}