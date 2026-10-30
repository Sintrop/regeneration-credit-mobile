/** Byte limits and bounds enforced by ResearcherRules, DeveloperRules and ContributorRules. */
export const CONTRACT_LIMITS = {
  name: 50,
  hash: 150,
  text: 300,
  title: 100,
  calculatorItem: 35,
  calculatorUnit: 20,
  minCarbonImpact: 1,
  maxCarbonImpact: 1000000,
} as const;
