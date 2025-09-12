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
        // Read locale from the URL path (highest priority)
        const pathMatch = window.location.pathname.match(/^\/(uz|ru|en)(?:\/|$)/);
        const pathLang = pathMatch?.[1];
        
        // If URL has language, use it
        if (pathLang && ["uz", "ru", "en"].includes(pathLang)) {
          setStoredValue(pathLang);
          if (i18n.language !== pathLang) {
            void i18n.changeLanguage(pathLang);
          }
          // Sync stores
          window.localStorage.setItem(key, pathLang);
          Cookies.set(key, pathLang, { expires: 365, path: "/" });
        } else {
          // No URL language - force Uzbek for first-time visitors
          const preferred = "uz";
          setStoredValue(preferred);
          if (i18n.language !== preferred) {
            void i18n.changeLanguage(preferred);
          }
          // Clear any existing cache that might cause Russian
          window.localStorage.removeItem(key);
          Cookies.remove(key, { path: "/" });
          // Set fresh Uzbek preference
          window.localStorage.setItem(key, preferred);
          Cookies.set(key, preferred, { expires: 365, path: "/" });
        }
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