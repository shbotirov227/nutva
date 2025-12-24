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
      title: "Nutva Pharm — Bo'g'im va suyak uchun biofaol qo'shimchalar",
      description: "Bel og'rig'iga, bo'g'im va suyak og'rig'iga yordam beruvchi tabiiy qo'shimchalar. Kollagen, xondroitin, gialuron kislotasi. Artrit, osteoxondroz va bo'g'imlarni mustahkamlash uchun. Nutva Complex — suyak va tog'ay tiklanishi uchun ilmiy asoslangan kompleks."
    },
    ru: {
      title: "Nutva Pharm — БАДы для суставов и костей",
      description: "Натуральные добавки для лечения боли в спине, суставах и костях. Коллаген, хондроитин, гиалуроновая кислота. При артрите, остеохондрозе и укреплении суставов. Nutva Complex — научно обоснованный комплекс для восстановления костей и хрящей."
    },
    en: {
      title: "Nutva Pharm — Dietary supplements for joints and bones",
      description: "Natural supplements for back pain, joint and bone pain relief. Collagen, chondroitin, hyaluronic acid. For arthritis, osteochondrosis and joint strengthening. Nutva Complex — science-backed complex for bone and cartilage recovery."
    }
  };
  
  return content[lang];
}