/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { feedService } from "../feedService";
import { paginateList } from "@utils";
import { useSettingsContext } from "@hooks";

interface Props {
  itemsPerPage: number;
}
export function useFeedInspections({ itemsPerPage }: Props) {
  const { rpc } = useSettingsContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [idsInspections, setIdsInspections] = useState<number[]>([]);
  const [idsPage, setIdsPage] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [atualPage, setAtualPage] = useState<number>(1);

  useEffect(() => {
    handleGetIds();
  }, []);

  async function handleGetIds() {
    setLoading(true);
    const response = await feedService.getListIdsInspections(rpc)
    setIdsInspections(response);
    console.log(response)

    const paginate = paginateList<number>({ atualPage, itemsPerPage, list: response })
    setIdsPage(paginate.list);
    setTotalPages(paginate.totalPages);

    setLoading(false);
  }

  function nextPage() {
    if (atualPage === totalPages) return;
    const nextPage = atualPage + 1;
    const paginate = paginateList<number>({ atualPage: nextPage, itemsPerPage, list: idsInspections });
    idsPage.push(...paginate.list);
    setAtualPage(nextPage);
  }

  return {
    totalPages,
    atualPage,
    idsInspections,
    idsPage,
    isLoading: loading,
    nextPage
  }
}

