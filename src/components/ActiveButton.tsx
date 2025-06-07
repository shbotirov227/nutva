"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type ButtonType = "popular" | "latest";

const ActiveButton = ({
	children,
	isActive,
	onClick,
}: {
	children: React.ReactNode;
	isActive: boolean;
	onClick: () => void;
}) => {
	return (
		<Button
			className={clsx(
				"bg-transparent border border-[#218A4F] text-[#218A4F] hover:bg-[#365343] hover:text-white transition-all cursor-pointer",
				{
					"bg-[#218A4F]": isActive,
					"text-white": isActive,
				}
			)}
			onClick={onClick}
		>
			{children}
		</Button>
	);
};

const ActiveButtonSection = () => {
	const [active, setActive] = useState<ButtonType>("popular");

	return (
		<div className="flex items-center justify-between gap-5">
			<ActiveButton
				isActive={active === "popular"}
				onClick={() => setActive("popular")}
			>
				Популярные
			</ActiveButton>
			<ActiveButton
				isActive={active === "latest"}
				onClick={() => setActive("latest")}
			>
				Последние
			</ActiveButton>
		</div>
	);
};

export default ActiveButtonSection;
