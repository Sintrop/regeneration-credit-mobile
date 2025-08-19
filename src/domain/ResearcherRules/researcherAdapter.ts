import { bigNumberToFloat } from "@utils";
import {
  CalculatorItemContractProps,
  CalculatorItemProps,
  EvaluationMethodContractProps,
  EvaluationMethodProps,
  ResearchContractProps,
  ResearcherContractProps,
  ResearcherProps,
  ResearchProps
} from "./types";

function parseResearcher(data: ResearcherContractProps): ResearcherProps {
  return {
    id: bigNumberToFloat(data.id),
    address: data.researcherWallet,
    canPublishMethod: data.canPublishMethod,
    createdAt: bigNumberToFloat(data.createdAt),
    lastCalculatorItemAt: bigNumberToFloat(data.lastCalculatorItemAt),
    lastPublishedAt: bigNumberToFloat(data.lastPublishedAt),
    name: data.name,
    proofPhoto: data.proofPhoto,
    publishedItems: bigNumberToFloat(data.publishedItems),
    publishedResearches: bigNumberToFloat(data.publishedResearches),
    pool: {
      level: bigNumberToFloat(data.pool.level),
      currentEra: bigNumberToFloat(data.pool.currentEra)
    }
  }
}

function parseResearch(data: ResearchContractProps): ResearchProps {
  return {
    id: bigNumberToFloat(data.id),
    createdAt: bigNumberToFloat(data.createdAtBlock),
    era: bigNumberToFloat(data.era),
    file: data.file,
    invalidatedAt: bigNumberToFloat(data.invalidatedAt),
    researcher: data.createdBy,
    thesis: data.thesis,
    title: data.title,
    valid: data.valid,
    validationsCount: bigNumberToFloat(data.validationsCount)
  }
}

function parseCalculatorItem(data: CalculatorItemContractProps): CalculatorItemProps {
  return {
    id: bigNumberToFloat(data.id),
    carbonImpact: bigNumberToFloat(data.carbonImpact),
    item: data.item,
    researcher: data.createdBy,
    thesis: data.thesis,
    unit: data.unit
  }
}

function parseEvaluationMethod(data: EvaluationMethodContractProps): EvaluationMethodProps {
  return {
    id: bigNumberToFloat(data.id),
    projectURL: data.projectURL,
    research: bigNumberToFloat(data.research),
    researcher: data.createdBy,
    title: data.title
  }
}

export const researcherAdapter = {
  parseResearcher,
  parseResearch,
  parseCalculatorItem,
  parseEvaluationMethod
}