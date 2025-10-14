import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { OffsetProps, supporterService } from "@domain";
import { useSettingsContext } from "@hooks";

interface ReturnUseGetOffset {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  offset: OffsetProps | undefined;
}
interface Props {
  offsetId: number
}
export function useGetOffset({ offsetId }: Props): ReturnUseGetOffset {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetOffset, offsetId],
    queryFn: () => supporterService.getOffset({ id: offsetId, rpc })
  })

  return {
    offset: data,
    isLoading,
    isError,
    refetch
  }
}