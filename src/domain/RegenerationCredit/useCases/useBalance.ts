import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { rcService } from "../rcService";

interface ReturnUseBalance {
  isLoading: boolean;
  refetch: () => void;
  balance: number;
  isError: boolean;
}

interface Props {
  address: string;
}
export function useBalance({ address }: Props): ReturnUseBalance {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetBalance, address],
    queryFn: () => rcService.getBalance({ address, rpc })
  });

  return {
    isLoading,
    refetch: refetch,
    balance: data ? data : 0,
    isError
  }
}