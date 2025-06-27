/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLang } from "@/context/LangContext";

type MultilangObject = {
  uz: Record<string, any>;
  ru: Record<string, any>;
  en: Record<string, any>;
  [key: string]: any;
};

export function useTranslatedData<T extends MultilangObject>(list: T[] = []): Array<T & T["uz"]> {
  const { lang } = useLang();
  return list.map((item) => ({
    ...item,
    ...(item?.[lang] || item?.uz),
  }));
}
