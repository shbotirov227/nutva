"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import i18n from "@/i18n";

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
  isLoading: boolean;
  availableLangs: string[];
};

const LangContext = createContext<LangContextType | undefined>(undefined);

function useLocalStorage(key: string, initialValue: string) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
  const cookieVal = Cookies.get(key);
  const lsVal = window.localStorage.getItem(key);
  // Read locale from the URL path (highest priority on first load)
  const pathMatch = window.location.pathname.match(/^\/(uz|ru|en)(?:\/|$)/);
  const pathLang = pathMatch?.[1];
  const preferred = (pathLang || cookieVal || lsVal || initialValue);
  setStoredValue(preferred);
  // Ensure i18next follows the resolved language immediately
  if (i18n.language !== preferred) {
    void i18n.changeLanguage(preferred);
  }
  // Sync both stores to preferred value
  if (lsVal !== preferred) window.localStorage.setItem(key, preferred);
  if (cookieVal !== preferred) Cookies.set(key, preferred, { expires: 365, path: "/" });
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
  window.localStorage.setItem(key, value);
  Cookies.set(key, value, { expires: 365, path: "/" });
      }
      // Keep i18next in sync with context updates
      if (i18n.language !== value) {
        void i18n.changeLanguage(value);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
}

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangStorage, isLoading] = useLocalStorage("lang", "uz");
  const availableLangs = ["uz", "ru", "en"];

  const setLang = (newLang: string) => {
    if (availableLangs.includes(newLang)) {
      setLangStorage(newLang);

      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
    } else {
      console.warn(`Language "${newLang}" is not available. Available languages:`, availableLangs);
    }
  };

  // Sahifa yuklanganda document lang atributini o'rnatish
  useEffect(() => {
    if (!isLoading && typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang, isLoading]);

  return (
    <LangContext.Provider value={{ lang, setLang, isLoading, availableLangs }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context)
    throw new Error("useLang must be used within LangProvider");
  return context;
};

export const useIsLangReady = () => {
  const { isLoading } = useLang();
  return !isLoading;
};

export const useLangSwitcher = () => {
  const { lang, setLang, availableLangs } = useLang();

  const switchLang = (newLang: string) => {
    if (newLang !== lang) {
      setLang(newLang);
    }
  };

  return { currentLang: lang, switchLang, availableLangs };
};