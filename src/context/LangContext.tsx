"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

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
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(item);
          // Keep cookie in sync if exists with different value
          if (Cookies.get(key) !== item) {
            Cookies.set(key, item, { expires: 365, path: "/" });
          }
        } else {
          // Initialize both localStorage and cookie with default
          window.localStorage.setItem(key, initialValue);
          Cookies.set(key, initialValue, { expires: 365, path: "/" });
          setStoredValue(initialValue);
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