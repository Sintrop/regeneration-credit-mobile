import { useSettingsContext } from "@hooks"
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@types";
import { inspectionService } from "../inspectionService";

interface Props {
  address: string
}
export function useUserInspections({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.UserInspections, address],
    queryFn: () => inspectionService.getUserInspections({ rpc, address })
  });

  return {
    inspections: data,
    isError,
    isLoading,
    refetch
  }
}