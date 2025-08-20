import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { regeneratorService } from "@domain";
import { QueryKeys } from "@types";

interface Props {
  address?: string;
}
export function useProjectDescription({ address }: Props) {
  const { rpc } = useSettingsContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.ProjectDescription, address],
    queryFn: () => regeneratorService.getProjectDescription({ rpc, address: address ? address : "" }),
    enabled: address ? true : false
  });

  return {
    projectDescription: data,
    isLoading,
    isError,
    refetch
  }
}