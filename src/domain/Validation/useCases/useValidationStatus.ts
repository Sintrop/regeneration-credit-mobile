import { useQuery } from "@tanstack/react-query";

import { useSettingsContext, useUserContext } from "@hooks";
import { QueryKeys } from "@types";

import { getValidationStatus } from "../validationService";
import { getVoteEligibility, ValidationTarget } from "../voteEligibility";

export function useValidationStatus(target: ValidationTarget, idOrAddress?: string | number) {
  const { rpc } = useSettingsContext();
  const { address, userType } = useUserContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.ValidationStatus, target, idOrAddress, address, userType],
    queryFn: () => getValidationStatus({ rpc, target, idOrAddress: idOrAddress as string | number, voterAddress: address, voterUserType: userType }),
    enabled: idOrAddress !== undefined && idOrAddress !== "" && idOrAddress !== 0,
  });

  return {
    status: data,
    eligibility: data ? getVoteEligibility(data.target, data.voter) : undefined,
    isLoading,
    refetch,
  };
}
