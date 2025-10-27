import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";
import { SupporterRules } from "@contracts";

import { rcService } from "../rcService";

interface ReturnUseApprovedTokens {
  isLoading: boolean;
  refetch: () => void;
  approvedTokens: number;
  isError: boolean;
}

interface Props {
  address: string;
}
export function useApprovedTokens({ address }: Props): ReturnUseApprovedTokens {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.ApprovedTokens, address, SupporterRules.address],
    queryFn: () => rcService.getTokensAllowed({ address, rpc, spendAddress: SupporterRules.address })
  });

  return {
    isLoading,
    refetch: refetch,
    approvedTokens: data ? data : 0,
    isError
  }
}