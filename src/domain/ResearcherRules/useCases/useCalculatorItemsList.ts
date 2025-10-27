/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { CalculatorItemProps } from "../types";
import { researcherService } from "../researcherService";
import { useSettingsContext } from "@hooks";

interface ReturnUseCalculatorItemsList {
  isLoading: boolean;
  refetch: () => void;
  calculatorItems: CalculatorItemProps[];
}
export function useCalculatorItemsList(): ReturnUseCalculatorItemsList {
  const { rpc } = useSettingsContext();
  const [list, setList] = useState<CalculatorItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    setIsLoading(true);
    let itemsList: CalculatorItemProps[] = [];

    const itemsCount = await researcherService.getTotalCalculatorItems({ rpc });

    for (let i = 1; i <= itemsCount; i++) {
      const item = await researcherService.getCalculatorItem({ itemId: i, rpc });
      itemsList.push(item);
    }

    setList(itemsList);
    setIsLoading(false);
  }

  return {
    isLoading,
    calculatorItems: list,
    refetch: getList
  }
}
