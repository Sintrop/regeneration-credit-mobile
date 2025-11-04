import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { rcService } from "../rcService";

interface ReturnUseCertificatedTokens {
  isLoading: boolean;
  refetch: () => void;
  certificated: number;
  isError: boolean;
}

interface Props {
  address: string;
}
export function useCertificatedTokens({ address }: Props): ReturnUseCertificatedTokens {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.CertificatedTokens, address],
    queryFn: () => rcService.getCertificatedTokens({ address, rpc })
  });

  return {
    isLoading,
    refetch: refetch,
    certificated: data ? data : 0,
    isError
  }
}