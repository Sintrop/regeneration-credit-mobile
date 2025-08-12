import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";
import { userService } from "@domain";

interface Props {
  address?: string;
  userType?: number;
}
export function useUserBasicData({ address, userType }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetBasicDataUser, address],
    queryFn: () => userService.getBasicData({
      address: address ? address : "",
      rpc,
      userType: userType ? userType : 0
    }),
    enabled: address && userType ? true : false
  })

  return {
    user: data,
    isLoading,
    isError,
    refetch
  }
}