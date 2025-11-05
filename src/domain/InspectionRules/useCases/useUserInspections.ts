import { useSettingsContext } from "@hooks"
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@types";
import { inspectionService } from "../inspectionService";
import { useEffect, useState } from "react";

interface Props {
  address: string
}
export function useUserInspections({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.UserInspections, address],
    queryFn: () => inspectionService.getUserInspections({ rpc, address })
  });

  const [treesAverage, setTreesAverage] = useState<number>(0);
  const [bioAverage, setBioAverage] = useState<number>(0);

  useEffect(() => {
    calculateAverages();
  }, [data]);

  function calculateAverages() {
    if (!data) return;

    const totalTrees = data?.reduce((total, item) => total + item.treesResult, 0);
    const totalBio = data?.reduce((total, item) => total + item.biodiversityResult, 0);

    setTreesAverage(Math.ceil(totalTrees / data.length));
    setBioAverage(Math.ceil(totalBio / data.length));
  }

  return {
    inspections: data,
    isError,
    isLoading,
    refetch,
    treesAverage,
    bioAverage
  }
}