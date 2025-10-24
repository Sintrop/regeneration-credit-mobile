/* eslint-disable react-hooks/exhaustive-deps */
import { FeedItemProps } from "@database";
import { feedAdapter, useContributionAdded, useOffsets, useRealizedInspections, useReportAdded, useResearchsPublished, useUserRegistered } from "@domain";
import { paginateList } from "@utils";
import { useEffect, useState } from "react";

interface ReturnUseNewFeed {
  isLoading: boolean;
  list: FeedItemProps[];
  nextPage: () => void;
}
export function useNewFeed(): ReturnUseNewFeed {
  const itemsPerPage = 10;
  const [list, setList] = useState<FeedItemProps[]>([]);
  const [listPage, setListPage] = useState<FeedItemProps[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [atualPage, setAtualPage] = useState<number>(1);

  const { offsets, isLoading: isLoadingOffsets } = useOffsets();
  const { realizedInspections, isLoading: isLoadingRealizedInspections } = useRealizedInspections();
  const { reports, isLoading: isLoadingReports } = useReportAdded();
  const { researchs, isLoading: isLoadingResearchs } = useResearchsPublished();
  const { contributions, isLoading: isLoadingContributions } = useContributionAdded();
  const { usersRegistered, isLoading: isLoadingUsersRegistered } = useUserRegistered();

  useEffect(() => {
    createFeedList()
  }, [offsets, realizedInspections, reports, researchs, contributions, usersRegistered])

  function createFeedList() {
    const newListFeed: FeedItemProps[] = [];
    const realizedInspectionsFeed = realizedInspections.map(feedAdapter.parseRealizedInspectionToFeed)
    newListFeed.push(...realizedInspectionsFeed);

    const offsetsFeed = offsets.map(feedAdapter.parseOffsetToFeed);
    newListFeed.push(...offsetsFeed);

    const reportsFeed = reports.map(feedAdapter.parseReportAddedToFeed);
    newListFeed.push(...reportsFeed);

    const researchsFeed = researchs.map(feedAdapter.parseResearchPublishedToFeed);
    newListFeed.push(...researchsFeed);

    const contributionsFeed = contributions.map(feedAdapter.parseContributionAddedToFeed);
    newListFeed.push(...contributionsFeed);

    const usersRegisteredFeed = usersRegistered.map(feedAdapter.parseUserRegisteredToFeed);
    newListFeed.push(...usersRegisteredFeed);

    const sortedList = newListFeed.sort((a, b) => b.createdAt - a.createdAt)
    const paginate = paginateList<FeedItemProps>({ atualPage, itemsPerPage, list: sortedList });
    setList(sortedList);
    setListPage(paginate.list);
    setTotalPages(paginate.totalPages);
  }

  function handleNextPage() {
    if (atualPage === totalPages) return;
    const nextPage = atualPage + 1;
    const paginate = paginateList<FeedItemProps>({ atualPage: nextPage, itemsPerPage, list });
    listPage.push(...paginate.list);
    setAtualPage(nextPage);
  }

  return {
    isLoading: isLoadingOffsets || isLoadingRealizedInspections || isLoadingReports || isLoadingResearchs || isLoadingContributions || isLoadingUsersRegistered,
    list: listPage,
    nextPage: handleNextPage
  }
}
