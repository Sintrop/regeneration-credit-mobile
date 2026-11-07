import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";
import { bigNumberToFloat } from "@utils";

import { inspectionContract } from "../inspectionContract";

/** Initial requests without delay and blocks to wait between later requests, read from InspectionRules. */
export function useInspectionRequestRules() {
  const { rpc } = useSettingsContext();
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.InspectionRequestRules],
    queryFn: async () => {
      const rules = await inspectionContract.requestRules({ rpc });
      return {
        allowedInitialRequests: bigNumberToFloat(rules.allowedInitialRequests),
        timeBetweenInspections: bigNumberToFloat(rules.timeBetweenInspections),
      };
    },
  });

  return { requestRules: data, isLoading };
}
