/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLang } from "@/context/LangContext";

export function useTranslatedList<T extends Record<string, any>>(list: T[] = []): any[] {
  const { lang } = useLang();
  return list.map((item) => item?.[lang] || item?.["uz"]);
}
