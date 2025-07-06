"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
  isLoading: boolean;
  availableLangs: string[];
};

const LangContext = createContext<LangContextType | undefined>(undefined);

// Custom hook localStorage bilan ishlash uchun
function useLocalStorage(key: string, initialValue: string) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(item);
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
}

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangStorage, isLoading] = useLocalStorage("lang", "uz");
  const availableLangs = ["uz", "ru", "en"]; // Mavjud tillar

  const setLang = (newLang: string) => {
    if (availableLangs.includes(newLang)) {
      setLangStorage(newLang);

      // Document til atributini o'zgartirish (SEO uchun)
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

// Helper hook - til yuklanishini kutish uchun
export const useIsLangReady = () => {
  const { isLoading } = useLang();
  return !isLoading;
};

// Helper hook - til o'zgartirishni hook orqali
export const useLangSwitcher = () => {
  const { lang, setLang, availableLangs } = useLang();

  const switchLang = (newLang: string) => {
    if (newLang !== lang) {
      setLang(newLang);
    }
  };

  return { currentLang: lang, switchLang, availableLangs };
};