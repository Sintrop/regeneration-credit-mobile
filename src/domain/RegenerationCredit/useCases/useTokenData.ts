import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { rcService } from "../rcService";

interface ReturnUseTokenData {
  totalSupply: number;
  totalLocked: number;
  totalCertified: number;
  circulatingSuplly: number;
  isLoading: boolean;
  refetch: () => void;
  isError: boolean;
}

export function useTokenData(): ReturnUseTokenData {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.TokenData],
    queryFn: () => rcService.getTokenData({ rpc })
  });

  return {
    circulatingSuplly: data?.circulatingSuplly ?? 0,
    totalCertified: data?.totalCertified ?? 0,
    totalLocked: data?.totalLocked ?? 0,
    totalSupply: data?.totalSupply ?? 0,
    isLoading,
    refetch: refetch,
    isError
  }
}