import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { getSupporterCompensations } from "./supporterCompensations";

export function useSupporterCompensations(address?: string) {
  const { rpc } = useSettingsContext();
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SupporterCompensations, address],
    queryFn: () => getSupporterCompensations(rpc, address as string),
    enabled: !!address,
  });
  return { compensations: data ?? [], isLoading };
}
