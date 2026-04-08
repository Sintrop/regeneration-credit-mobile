import { useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Screen } from "@components";
import { AppStackParamsList } from "@routes";
import { useUserTypesTotalCount } from "@domain";
import { paginateList } from "@utils";

import { UserItem } from "./components/UserItem";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'UsersListScreen'>;
export function UsersListScreen({ route, navigation }: ScreenProps) {
  const { userType } = route.params;
  const { t } = useTranslation();
  const { isLoading, ids} = useUserTypesTotalCount({ userType });

  const ITEMS_PER_PAGE = 10;
  const [atualPage, setAtualPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [list, setList] = useState<number[]>([]);

  useEffect(() => {
    if (ids.length > 0 && list.length === 0) {
      function getFirstPage() {
        const response = paginateList<number>({ atualPage, itemsPerPage: ITEMS_PER_PAGE, list: ids });
        setList(response.list);
        setTotalPages(response.totalPages);
      }
      getFirstPage();
    }
  }, [ids, list]);

  function handleNextPage() {
    if (atualPage === totalPages) return;
    const response = paginateList<number>({ atualPage: atualPage + 1, itemsPerPage: ITEMS_PER_PAGE, list: ids });
    setList((value) => [...value, ...response.list]);
    setAtualPage((value) => value + 1);
  }

  function renderUserItem({ item }: ListRenderItemInfo<number>) {
    return (
      <UserItem 
        id={item} 
        userType={userType} 
        handleGoToUserDetail={(address) => navigation.navigate('UserDetailsScreen', { address })}
      />
    )
  }

  return (
    // @ts-ignore
    <Screen title={t(titles[userType])} isLoading={isLoading} showBackButton>
      <FlatList
        data={list}
        keyExtractor={item => item.toString()}
        renderItem={renderUserItem}
        onEndReachedThreshold={0.5}
        onEndReached={handleNextPage}
        contentContainerClassName="px-3 gap-3 pt-3 pb-10"
      />
    </Screen>
  )
}

const titles = {
  1: 'community.regenerators',
  2: 'community.inspectors',
  3: 'community.researchers',
  4: 'community.developers',
  5: 'community.contributors',
  6: 'community.activists',
  7: 'community.supporters'
}
