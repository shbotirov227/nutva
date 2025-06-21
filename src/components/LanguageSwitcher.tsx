'use client';

import clsx from "clsx";
import { useTranslation } from "react-i18next";

const languages = ["uz", "ru", "en"];

export default function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng)
	}

	return (
		<div className="flex items-center gap-1 ml-15">
			{languages.map((lng) => (
				<button
					key={lng}
					onClick={() => changeLanguage(lng)}
					className={clsx(
						"text-white text-lg border-white p-1 rounded cursor-pointer transition-colors duration-300",
					)}
				>
					{lng.toUpperCase()}
				</button>
			))}
		</div>
	);
}
