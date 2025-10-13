import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";
import { inspectorService } from "@domain";

interface Props {
  address: string;
}
export function useGetInspector({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetInspector, address],
    queryFn: () => inspectorService.getInspector({ address, rpc })
  });

  return {
    inspector: data,
    isLoading,
    isError,
    refetch
  }
}