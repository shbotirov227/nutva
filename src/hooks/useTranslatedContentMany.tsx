/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useTranslatedContentMany.ts
import { useTranslation } from "react-i18next";

export function useTranslatedContentMany<T extends Record<string, any>>(dataArray: T[]) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "uz";

  return dataArray.map((item) => ({
    id: item.id,
    ...item?.[lang] || item?.["uz"],
  }));
}
