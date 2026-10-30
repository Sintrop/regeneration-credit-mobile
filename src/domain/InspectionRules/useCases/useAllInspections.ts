import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { inspectionService } from "../inspectionService";
import { InspectionProps } from "../types";

const BATCH_SIZE = 15;

/** Every inspection, newest first, read in batches to keep the RPC load bounded. */
async function getAllInspections(rpc: string): Promise<InspectionProps[]> {
  const total = await inspectionService.getTotalInspections({ rpc });
  const ids = Array.from({ length: total }, (_, index) => total - index);
  const result: InspectionProps[] = [];

  for (let start = 0; start < ids.length; start += BATCH_SIZE) {
    const batch = await Promise.all(
      ids.slice(start, start + BATCH_SIZE).map(inspectionId =>
        inspectionService.getInspection({ rpc, inspectionId }).catch(() => null)
      )
    );
    result.push(...batch.filter((item): item is InspectionProps => item !== null));
  }

  return result;
}

export function useAllInspections(enabled = true) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [QueryKeys.AllInspections],
    queryFn: () => getAllInspections(rpc),
    enabled,
  });
  return { inspections: data ?? [], isLoading, refetch, isRefetching };
}
