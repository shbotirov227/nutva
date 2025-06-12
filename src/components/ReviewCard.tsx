import React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ReviewCardImg from "@/assets/images/reviewcard-img.png";

const ReviewCard = () => {
	return (
		<Card className="w-full max-w-xs sm:max-w-sm md:max-w-md min-h-[280px] pt-0 bg-[#1E2B66] shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)] box-border overflow-hidden mx-auto">
			<CardHeader className="p-0 overflow-hidden">
				<Image
					src={ReviewCardImg}
					alt="hero-bg"
					width={400}
					height={150}
					className="w-full h-[120px] sm:h-[140px] object-cover rounded-t-lg box-border cursor-pointer"
				/>
			</CardHeader>
			<CardContent className="p-4 sm:p-5">
				<CardTitle className="text-base sm:text-lg text-white font-semibold mb-2 sm:mb-5">
					Norem ipsum dolor sit amet, consectetur adipiscing elit.
				</CardTitle>
				<CardDescription className="text-white text-xs sm:text-sm">
					Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
				</CardDescription>
			</CardContent>
		</Card>
	)
}

export default ReviewCard;
