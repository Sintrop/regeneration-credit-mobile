import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";
import { bigNumberToFloat } from "@utils";

import { inspectionContract } from "../inspectionContract";
import { inspectionAdapter } from "../inspectionAdapter";
import { ImpactPerEraProps } from "../types";

export interface ImpactSettlement {
  lastSettledEra: number;
  realizedInspections: number;
  inspectionsTrees: number;
  inspectionsBiodiversity: number;
  certifiedRegenerators: number;
}

export function useImpactSettlement() {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.ImpactSettlement, rpc],
    queryFn: async (): Promise<ImpactSettlement> => {
      const raw = await inspectionContract.impactSettlement({ rpc });
      return {
        lastSettledEra: bigNumberToFloat(raw.lastSettledEra),
        realizedInspections: bigNumberToFloat(raw.realizedInspectionsCount),
        inspectionsTrees: bigNumberToFloat(raw.inspectionsTreesImpact),
        inspectionsBiodiversity: bigNumberToFloat(raw.inspectionsBiodiversityImpact),
        certifiedRegenerators: bigNumberToFloat(raw.totalImpactRegenerators),
      };
    },
  });

  return { settlement: data, isLoading, isError };
}

/** InspectionRules.impactPerEra for every era from 1 to the current one, newest first. */
export function useImpactEras(currentEra: number) {
  const { rpc } = useSettingsContext();
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.ImpactEras, rpc, currentEra],
    enabled: currentEra > 0,
    queryFn: async (): Promise<(ImpactPerEraProps & { era: number })[]> => {
      const eras = Array.from({ length: currentEra }, (_, index) => currentEra - index);
      const results = await Promise.all(eras.map(era => inspectionContract.impactPerEra({ rpc, era })));
      return results.map((result, index) => ({ era: eras[index], ...inspectionAdapter.parseImpactPerEra(result) }));
    },
  });

  return { eras: data ?? [], isLoading: currentEra > 0 && isLoading };
}
