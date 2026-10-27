import { researcherService } from "../ResearcherRules/researcherService";
import { contributorService } from "../ContributorRules/contributorService";
import { developerService } from "../DeveloperRules/developerService";
import { PublishedResource } from "./types";

function idsUpTo(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

async function getResearches(rpc: string): Promise<PublishedResource[]> {
  const count = await researcherService.getTotalResearches({ rpc });
  const items = await Promise.all(idsUpTo(count).map(researchId => researcherService.getResearch({ rpc, researchId })));

  return items.filter(item => item.valid).map(item => ({
    type: 'research',
    id: item.id,
    title: item.title,
    body: item.thesis,
    author: item.researcher,
    era: item.era,
    file: item.file,
    createdAtBlock: item.createdAt,
    validationsCount: item.validationsCount,
  }));
}

async function getContributions(rpc: string): Promise<PublishedResource[]> {
  const count = await contributorService.getTotalContributions({ rpc });
  const items = await Promise.all(idsUpTo(count).map(contributionId => contributorService.getContribution({ rpc, contributionId })));

  return items.filter(item => item.valid).map(item => ({
    type: 'contribution',
    id: item.id,
    title: '',
    body: item.description,
    author: item.contributor,
    era: item.era,
    file: item.report,
    createdAtBlock: item.createdAt,
    validationsCount: item.validationsCount,
  }));
}

async function getReports(rpc: string): Promise<PublishedResource[]> {
  const count = await developerService.getTotalReports({ rpc });
  const items = await Promise.all(idsUpTo(count).map(reportId => developerService.getReport({ rpc, reportId })));

  return items.filter(item => item.valid).map(item => ({
    type: 'report',
    id: item.id,
    title: '',
    body: item.description,
    author: item.developer,
    era: item.era,
    file: item.report,
    createdAtBlock: item.createdAtBlockNumber,
    validationsCount: item.validationsCount,
  }));
}

/** Valid researches, contributions and development reports, newest first. */
async function getPublishedResources({ rpc }: { rpc: string }): Promise<PublishedResource[]> {
  const groups = await Promise.all([
    getResearches(rpc).catch(() => []),
    getContributions(rpc).catch(() => []),
    getReports(rpc).catch(() => []),
  ]);

  return groups.flat().sort((a, b) => b.createdAtBlock - a.createdAtBlock);
}

export const resourcesService = {
  getPublishedResources,
};
