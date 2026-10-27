import { useGetUser, useUserBasicData } from "@domain";

/** Registered user type, name and photo for the address that emitted a feed event. */
export function useFeedUser(address?: string) {
  const { userType, isLoading: isLoadingType } = useGetUser({ address });
  const { user, isLoading: isLoadingData } = useUserBasicData({ address, userType });

  return {
    userType,
    name: user?.name,
    photo: user?.photo,
    isLoading: isLoadingType || (userType > 0 && isLoadingData),
  };
}
