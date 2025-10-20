import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { SupporterProps, supporterService } from "@domain";
import { useSettingsContext } from "@hooks";

interface ReturnUseGetSupporter {
  isLoading: boolean;
  isError: boolean;
  supporter?: SupporterProps;
  refetch: () => void;
}
interface Props {
  address: string
}
export function useGetSupporter({ address }: Props): ReturnUseGetSupporter {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetSupporter, address],
    queryFn: () => supporterService.getSupporter({ address, rpc })
  })

  return {
    supporter: data,
    isLoading,
    isError,
    refetch
  }
}