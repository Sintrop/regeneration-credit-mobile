export interface ResearcherContractProps {
  id: string;
  researcherWallet: string;
  name: string;
  proofPhoto: string;
  publishedResearches: string;
  lastPublishedAt: string;
  publishedItems: string;
  lastCalculatorItemAt: string;
  createdAt: string;
  canPublishMethod: boolean;
  pool: {
    level: string;
    currentEra: string;
  }
}

export interface ResearcherProps {
  id: number;
  address: string;
  name: string;
  proofPhoto: string;
  publishedResearches: number;
  lastPublishedAt: number;
  publishedItems: number;
  lastCalculatorItemAt: number;
  createdAt: number;
  canPublishMethod: boolean;
  pool: {
    level: number;
    currentEra: number;
  }
}

export interface ResearchContractProps {
  id: string;
  era: string;
  createdBy: string;
  title: string;
  thesis: string;
  file: string;
  validationsCount: string;
  valid: boolean;
  invalidatedAt: string;
  createdAtBlock: string;
}

export interface ResearchProps {
  id: number;
  era: number;
  researcher: string;
  title: string;
  thesis: string;
  file: string;
  validationsCount: number;
  valid: boolean;
  invalidatedAt: number;
  createdAt: number;
}

export interface CalculatorItemContractProps {
  id: string;
  createdBy: string;
  item: string;
  thesis: string;
  unit: string;
  carbonImpact: string;
}

export interface CalculatorItemProps {
  id: number;
  researcher: string;
  item: string;
  thesis: string;
  unit: string;
  carbonImpact: number;
}

export interface EvaluationMethodContractProps {
  id: string;
  createdBy: string;
  title: string;
  research: string;
  projectURL: string;
}

export interface EvaluationMethodProps {
  id: number;
  researcher: string;
  title: string;
  research: number;
  projectURL: string;
}