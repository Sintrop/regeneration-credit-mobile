/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { feedService } from "../feedService";
import { useSettingsContext } from "@hooks";
import { databaseService, FeedItemProps, database } from "@database";
import { inspectionService } from "@domain";
import { paginateList } from "@utils";

interface TotalResourcesSaved {
  inspections: number;
}

export function useFeed() {
  const itemsPerPage = 10;
  const { rpc } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<FeedItemProps[]>([]);
  const [listPage, setListPage] = useState<FeedItemProps[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [atualPage, setAtualPage] = useState<number>(1);

  useEffect(() => {
    checkHasUpdate();
    getFeedList();
  }, []);

  async function getFeedList() {
    const response = await databaseService.getFeedList();
    const paginate = paginateList<FeedItemProps>({ atualPage, itemsPerPage, list: response });
    setListPage(paginate.list);
    setList(response);

    setTotalPages(paginate.totalPages);
  }

  async function checkHasUpdate() {
    setIsLoading(true);

    const totalSaved = await getTotalResourcesSaved();
    const totalResources = await feedService.getTotalResources({ rpc })

    //Check inspections
    if (totalSaved.inspections < totalResources.inspectionsCount) {
      const inspectionsCount = totalResources.inspectionsCount;
      await registerInspections({ inspectionsCount });
      await saveTotalResourcesFeed({ ...totalSaved, inspections: inspectionsCount });
    }

    getFeedList();
    setIsLoading(false);
  }

  async function getTotalResourcesSaved(): Promise<TotalResourcesSaved> {
    const response = await AsyncStorage.getItem("total_resources_saved");
    if (response) {
      const data = JSON.parse(response) as TotalResourcesSaved;
      return data;
    }

    return {
      inspections: 0
    }
  }

  async function saveTotalResourcesFeed(data: TotalResourcesSaved): Promise<void> {
    await AsyncStorage.setItem("total_resources_saved", JSON.stringify(data));
  }

  async function registerInspections({ inspectionsCount }: { inspectionsCount: number }) {
    const ids = Array.from({ length: inspectionsCount }, (_, i) => i + 1).slice(0, 9);

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const exists = await database.checkResourceExists({ id, resourceType: "inspection" });

      if (!exists) {
        const inspection = await inspectionService.getInspection({ rpc, inspectionId: id });
        await database.insertResourceFeed({
          createdAt: inspection.createdAt,
          resourceId: id,
          resourceType: "inspection"
        })
      }
    }
  }

  function handleNextPage() {
    if (atualPage === totalPages) return;
    const nextPage = atualPage + 1;
    const paginate = paginateList<FeedItemProps>({ atualPage: nextPage, itemsPerPage, list });
    listPage.push(...paginate.list);
    setAtualPage(nextPage);
  }

  return {
    isLoading,
    list: listPage,
    nextPage: handleNextPage
  }
}