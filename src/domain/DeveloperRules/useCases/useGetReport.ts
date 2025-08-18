import { useSettingsContext } from "@hooks"
import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@types"
import { developerService } from "@domain";

interface Props {
  reportId: number
}
export function useGetReport({ reportId }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetReport, reportId],
    queryFn: () => developerService.getReport({ reportId, rpc }),
  });

  return {
    report: data,
    isError,
    isLoading,
    refetch
  }
}