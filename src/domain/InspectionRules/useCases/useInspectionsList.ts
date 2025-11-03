import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { inspectionService } from "../inspectionService";
import { paginateList } from "@utils";

interface ReturnUseInspectionsList {
  isLoading: boolean;
  totalInspections: number;
  totalPages: number;
  currentPage: number;
  isError: boolean;
  list: number[];
  refetch: () => void;
  nextPage: () => void;
}
export function useInspectionsList(): ReturnUseInspectionsList {
  const itemsPerPage = 5;
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.TotalInspections],
    queryFn: () => inspectionService.getTotalInspections({ rpc })
  });
  const totalInspections = data ? data : 0;

  const [idsInspections, setIdsInspections] = useState<number[]>([]);
  const [idsPage, setIdsPage] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [atualPage, setAtualPage] = useState<number>(1);

  useEffect(() => {
    createIdsList();
  }, [totalInspections]);

  function createIdsList() {
    if (totalInspections === 0) return;
    const ids = Array.from({ length: totalInspections }, (_, i) => i + 1).reverse();
    setIdsInspections(ids);
    const paginate = paginateList<number>({ atualPage, itemsPerPage, list: ids });
    setIdsPage(paginate.list);
    setTotalPages(paginate.totalPages);
  }

  function handleRefetch() {
    refetch();
    setIdsInspections([]);
    setIdsPage([]);
    createIdsList();
  }

  function handleNextPage() {
    if (atualPage === totalPages) return;
    const nextPage = atualPage + 1;
    const paginate = paginateList<number>({ atualPage: nextPage, itemsPerPage, list: idsInspections });
    idsPage.push(...paginate.list);
    setAtualPage(nextPage);
  }

  return {
    isLoading,
    totalInspections,
    totalPages,
    currentPage: atualPage,
    isError,
    list: idsPage,
    refetch: handleRefetch,
    nextPage: handleNextPage
  }
}