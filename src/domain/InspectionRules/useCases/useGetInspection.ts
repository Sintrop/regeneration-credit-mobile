import { useSettingsContext } from "@hooks"
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@types";
import { inspectionService } from "../inspectionService";

interface Props {
  inspectionId: number
}
export function useGetInspection({ inspectionId }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetInspection, inspectionId],
    queryFn: () => inspectionService.getInspection({ rpc, inspectionId })
  });

  return {
    inspection: data,
    isError,
    isLoading,
    refetch
  }
}