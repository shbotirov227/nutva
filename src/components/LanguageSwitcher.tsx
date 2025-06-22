'use client';

import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Cookies from "js-cookie";
import { useLang } from "@/context/LangContext";
import clsx from "clsx";

const languages = [
  { label: "UZ", value: "uz" },
  { label: "RU", value: "ru" },
  { label: "EN", value: "en" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { lang, setLang } = useLang();
  const queryClient = useQueryClient();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);

    localStorage.setItem("lang", value);
    Cookies.set("lang", value);
    setLang(value);
    queryClient.invalidateQueries();
  };

  return (
    // <Select value={lang} onValueChange={handleChange}>
    //   <SelectTrigger className="border-none max-w-[70px] cursor-pointer text-white relative">
    //     <SelectValue placeholder="Lang" />
    //   </SelectTrigger>
    //   <SelectContent position="popper" className="bg-[rgba(20,20,20,0.7)] backdrop-blur-xl text-white right-15">
    //     {languages.map((lang) => (
    //       <SelectItem key={lang.value} value={lang.value} className="hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-all">
    //         {lang.label}
    //       </SelectItem>
    //     ))}
    //   </SelectContent>
    // </Select>
    <div className="flex items-center gap-3">
      {languages.map((lng) => {
        return (
          <button
            key={lng.value}
            value={lang}
            onClick={() => handleChange(lng.value)}
            className={clsx(
              "text-lg pb-2 px-4 h-auto font-medium transition-colors cursor-pointer",
              languages[1] === lng ? "border-x-1" : "border-none"
            )}
          >
            {lng.label}
          </button>
        )
      })}
    </div>

  );
}
