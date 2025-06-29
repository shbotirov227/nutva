/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLang } from "@/context/LangContext";

type MultilangData =
  | {
    uz: Record<string, any>;
    ru: Record<string, any>;
    en: Record<string, any>;
    [key: string]: any;
  }
  | Array<{
    uz: Record<string, any>;
    ru: Record<string, any>;
    en: Record<string, any>;
    [key: string]: any;
  }>;

export function useTranslated<T extends MultilangData | undefined>(data: T): T extends any[] ? Array<any> : any {
  const { lang } = useLang();

  if (!data) return [] as any as T[];

  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      ...(item?.[lang] || item?.uz),
    })) as any;
  } else if (typeof data === "object" && data !== null) {
    return {
      ...data,
      ...(data?.[lang] || data?.uz),
    } as any;
  }

  return data;
}
