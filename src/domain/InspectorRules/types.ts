export interface InspectorContractProps {
  id: string;
  inspectorWallet: string;
  name: string;
  proofPhoto: string;
  giveUps: string;
  lastAcceptedAt: string;
  lastRealizedAt: string;
  lastInspection: string;
  pool: {
    level: string;
    currentEra: string;
  }
  createdAt: string;
}

export interface InspectorProps {
  id: number;
  address: string;
  name: string;
  proofPhoto: string;
  giveUps: number;
  lastAcceptedAt: number;
  lastRealizedAt: number;
  lastInspection: number;
  pool: {
    level: number;
    currentEra: number;
  }
  createdAt: number;
}