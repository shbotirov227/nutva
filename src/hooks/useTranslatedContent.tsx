/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";

export function useTranslatedContent<T extends Record<string, any>>(data: T): T[string] {
  const { i18n } = useTranslation();
  const lang = i18n.language || "uz";
  return data?.[lang] || data?.["uz"];
}