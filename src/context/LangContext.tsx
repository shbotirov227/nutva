"use client";
import { createContext, useContext, useEffect, useState } from "react";

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState("uz");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "uz";
    setLang(storedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
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
