export interface RegeneratorContractProps {
  id: string;
  regeneratorWallet: string;
  name: string;
  proofPhoto: string;
  totalArea: string;
  pendingInspection: boolean;
  totalInspections: string;
  lastRequestAt: string;
  regenerationScore: {
    score: string;
  }
  pool: {
    onContractPool: boolean;
    currentEra: string;
  }
  createdAt: string;
  coordinatesCount: string;
}

export interface RegeneratorProps {
  id: number;
  address: string;
  name: string;
  proofPhoto: string;
  totalArea: number;
  pendingInspection: boolean;
  totalInspections: number;
  lastRequestAt: number;
  regenerationScore: {
    score: number;
  }
  pool: {
    onContractPool: boolean;
    currentEra: number;
  }
  createdAt: number;
  coordinatesCount: number;
}

export interface CoordinateContractProps {
  latitude: string;
  longitude: string;
}

export interface CoordinateProps {
  latitude: number;
  longitude: number;
}