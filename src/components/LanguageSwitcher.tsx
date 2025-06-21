'use client';

import { useTranslation } from "react-i18next";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Cookies from "js-cookie";

const languages = [
	{ label: "UZ", value: "uz" },
	{ label: "RU", value: "ru" },
	{ label: "EN", value: "en" },
];

export default function LanguageSwitcher () {
	const { i18n } = useTranslation();

	const currentLang = i18n.language;

  const handleChange = (value: string) => {
    Cookies.set("lang", value);
    localStorage.setItem("lang", value);
		i18n.changeLanguage(value);
	};

	return (
		<Select value={currentLang} onValueChange={handleChange}>
			<SelectTrigger className="border-none max-w-[70px] cursor-pointer text-white relative">
				<SelectValue placeholder="Lang" />
			</SelectTrigger>
			<SelectContent position="popper" className="bg-[rgba(20,20,20,0.7)] backdrop-blur-xl text-white right-15">
				{languages.map((lang) => (
					<SelectItem key={lang.value} value={lang.value} className="hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-all">
						{lang.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
