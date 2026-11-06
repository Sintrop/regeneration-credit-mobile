import { useTranslation } from "react-i18next";

import { blocksToDuration } from "../utils/blocksToDuration";

/** Formats a block count as "~167 days (1,112,321 blocks)" in the current language. */
export function useBlocksDuration() {
  const { t, i18n } = useTranslation();

  return function formatBlocks(blocks: number): string {
    const { value, unit } = blocksToDuration(blocks);
    return t('duration.withBlocks', {
      duration: t(`duration.${unit}`, { count: value }),
      blocks: Intl.NumberFormat(i18n.language).format(Math.abs(Math.round(blocks))),
    });
  };
}
