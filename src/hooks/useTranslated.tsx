/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLang } from "@/context/LangContext";

type LangKey = "uz" | "ru" | "en";

type MultilangItem = {
  uz: Record<string, any>;
  ru: Record<string, any>;
  en: Record<string, any>;
  [key: string]: any;
};

type MultilangData = MultilangItem | MultilangItem[];

/**
 * Translates data based on current language.
 * Supports both object and array of objects with `uz`, `ru`, `en` keys.
 */
export function useTranslated<T extends MultilangData | undefined>(
  data: T
): T extends MultilangItem[] ? Array<Record<string, any>> : Record<string, any> {
  const { lang } = useLang();

  if (!data) return ([] as unknown) as any;

  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      ...(item?.[lang as LangKey] || item?.uz),
    })) as any;
  }

  if (typeof data === "object" && data !== null) {
    return {
      ...data,
      ...(data?.[lang as LangKey] || data?.uz),
    } as any;
  }

  return data as any;
}
