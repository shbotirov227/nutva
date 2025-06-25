/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";

type SupportedLangs = "uz" | "ru" | "en";

export function useLocalizedProduct<T extends Record<SupportedLangs, any>>(
  product: T | undefined | null,
  lang: string
) {
  return useMemo(() => {
    if (!product) return null;

    const supportedLangs: SupportedLangs[] = ["uz", "ru", "en"];
    const currentLang: SupportedLangs = supportedLangs.includes(lang as SupportedLangs)
      ? (lang as SupportedLangs)
      : "uz";

    return product[currentLang];
  }, [product, lang]);
}
