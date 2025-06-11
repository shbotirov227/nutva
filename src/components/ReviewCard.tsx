import React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ReviewCardImg from "@/assets/images/reviewcard-img.png";

const ReviewCard = () => {
	return (
		<Card className="w-[100%] min-h-[100%] pt-0 bg-[#1E2B66] shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)] box-border overflow-hidden">
			<CardHeader className="p-0 overflow-hidden">
				<Image
					src={ReviewCardImg}
					alt="hero-bg"
					width={0}
					height={0}
					className="min-w-[100%] h-[150px] object-cover rounded-t-lg box-border cursor-pointer"
				/>
			</CardHeader>
			<CardContent>
				<CardTitle className="text-lg text-white font-semibold mb-5">Norem ipsum dolor sit amet, consectetur adipiscing elit.</CardTitle>
				<CardDescription className="text-white text-sm">Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</CardDescription>
			</CardContent>
		</Card>
	)
}

export default ReviewCard;