export interface ContributorContractProps {
  id: string;
  contributorWallet: string;
  name: string;
  proofPhoto: string;
  createdAt: string;
  lastPublishedAt: string;
  pool: {
    level: string;
    currentEra: string;
  }
}

export interface ContributorProps {
  id: number;
  address: string;
  name: string;
  proofPhoto: string;
  createdAt: number;
  lastPublishedAt: number;
  pool: {
    level: number;
    currentEra: number
  }
}

export interface ContributionContractProps {
  id: string;
  era: string;
  user: string;
  description: string;
  report: string;
  validationsCount: string;
  valid: boolean;
  invalidatedAt: string;
  createdAtBlockNumber: string;
}

export interface ContributionProps {
  id: number;
  era: number;
  contributor: string;
  description: string;
  report: string;
  validationsCount: number;
  valid: boolean;
  invalidatedAt: number;
  createdAt: number;
}