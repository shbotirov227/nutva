// src/lib/langUtils.ts
import { cookies, headers } from "next/headers";

export type Lang = "uz" | "ru" | "en";
export const supportedLangs: Lang[] = ["uz", "ru", "en"];
export const defaultLang: Lang = "uz";

/**
 * Extract language from URL pathname (most reliable for OpenGraph crawlers)
 */
export function extractLangFromPath(pathname: string): Lang | null {
  const match = pathname.match(/^\/(uz|ru|en)(?:\/|$)/);
  return match ? (match[1] as Lang) : null;
}

/**
 * Resolve language from multiple sources with proper priority
 * 1. URL path (most reliable for crawlers)
 * 2. x-lang header (set by middleware)
 * 3. Cookie
 * 4. Fallback to default
 */
export async function resolveLang(): Promise<Lang> {
  try {
    const h = await headers();
    const c = await cookies();
    
    // Get current URL path from headers
    const pathname = h.get("x-pathname") || h.get("x-invoke-path") || "";
    
    // 1. Try to extract from URL path first (most reliable for social media crawlers)
    const pathLang = extractLangFromPath(pathname);
    if (pathLang) {
      return pathLang;
    }
    
    // 2. Check x-lang header (set by middleware)
    const headerLang = h.get("x-lang")?.toLowerCase();
    if (headerLang && supportedLangs.includes(headerLang as Lang)) {
      return headerLang as Lang;
    }
    
    // 3. Check cookie
    const cookieLang = c.get("lang")?.value?.toLowerCase();
    if (cookieLang && supportedLangs.includes(cookieLang as Lang)) {
      return cookieLang as Lang;
    }
    
    // 4. Fallback
    return defaultLang;
  } catch (error) {
    console.error("Error resolving language:", error);
    return defaultLang;
  }
}

/**
 * Get OpenGraph locale string from language code
 */
export function getOgLocale(lang: Lang): string {
  switch (lang) {
    case "ru": return "ru_RU";
    case "en": return "en_US";
    default: return "uz_UZ";
  }
}

/**
 * Get alternate locales (excluding current one)
 */
export function getAlternateLocales(currentLang: Lang): string[] {
  const allLocales = ["uz_UZ", "ru_RU", "en_US"];
  const currentLocale = getOgLocale(currentLang);
  return allLocales.filter(locale => locale !== currentLocale);
}

/**
 * Build localized URLs
 */
export function buildLocalizedUrls(basePath: string, baseUrl: string = "https://nutva.uz"): Record<string, string> {
  const cleanBasePath = basePath.replace(/^\/(uz|ru|en)/, "");
  return {
    uz: `${baseUrl}/uz${cleanBasePath}`,
    ru: `${baseUrl}/ru${cleanBasePath}`,
    en: `${baseUrl}/en${cleanBasePath}`,
    "x-default": `${baseUrl}/uz${cleanBasePath}`
  };
}

/**
 * Get multilingual metadata content
 */
export interface MultilingualContent {
  title: string;
  description: string;
}

export function getHomePageContent(lang: Lang): MultilingualContent {
  const content = {
    uz: {
      title: "Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar",
      description: "Nutva Pharm — ilmiy asoslangan, sifatli va tabiiy biofaol qo'shimchalar. Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir."
    },
    ru: {
      title: "Nutva Pharm — Научно обоснованные биологически активные добавки",
      description: "Nutva Pharm — научно обоснованные, сертифицированные и натуральные БАДы. Каждый продукт — точное решение для восстановления и укрепления здоровья."
    },
    en: {
      title: "Nutva Pharm — Science‑backed dietary supplements",
      description: "Nutva Pharm — science‑backed, certified and natural supplements. Each product is a precise solution to restore and strengthen your health."
    }
  };
  
  return content[lang];
}