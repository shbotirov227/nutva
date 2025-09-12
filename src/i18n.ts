import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"

const Languages = ["uz", "ru", "en"] as const

// Helper to read lang from <html lang> or URL on first load (SSR/CSR safe guards inside detectors)
const getInitialLang = () => {
  if (typeof document !== 'undefined') {
    const tag = document.documentElement.getAttribute('lang');
    if (tag && ["uz","ru","en"].includes(tag)) return tag;
    const m = window.location.pathname.match(/^\/(uz|ru|en)(?:\/|$)/);
    if (m) return m[1];
  }
  return undefined;
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "uz",
    debug: false,
    supportedLngs: Languages,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Strict order: URL path first, then cookie, ignore browser language completely
      order: ["path", "cookie"],
      lookupCookie: "lang",
      caches: ["cookie"],
      lookupFromPathIndex: 0,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      useSuspense: false,
    },
    lng: getInitialLang(),
  })

export default i18n
