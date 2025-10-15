export interface DeveloperContractProps {
  id: string;
  developerWallet: string;
  name: string;
  proofPhoto: string;
  totalReports: string;
  createdAt: string;
  lastPublishedAt: string;
  pool: {
    level: string;
    currentEra: string;
  }
}

export interface DeveloperProps {
  id: number;
  address: string;
  name: string;
  proofPhoto: string;
  totalReports: number;
  createdAt: number;
  lastPublishedAt: number;
  pool: {
    level: number;
    currentEra: number;
  }
}

export interface ReportContractProps {
  id: string;
  era: string;
  developer: string;
  description: string;
  report: string;
  validationsCount: string;
  valid: boolean;
  invalidatedAt: string;
  createdAtBlockNumber: string;
}

export interface ReportProps {
  id: number;
  era: number;
  developer: string;
  description: string;
  report: string;
  validationsCount: number;
  valid: boolean;
  invalidatedAt: number;
  createdAtBlockNumber: number;
}

export interface ReportAddedEvent {
  id: string;
  developerAddress: string;
  description: string;
  blockNumber: string;
}

export interface ReportAdded {
  id: number;
  address: string;
  description: string;
  createdAt: number;
}