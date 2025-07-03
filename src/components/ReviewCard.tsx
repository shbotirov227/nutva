import React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ReviewCardImg from "@/assets/images/reviewcard-img.png";
import YouTubeEmbed from "./YouTubeEmbed";

interface ReviewCardProps {
  url: string;
  title: string;
  description: string;
  onPlay?: () => void;
}

const ReviewCard = ({ url, title, description, onPlay }: ReviewCardProps) => {

  const renderDescriptionWithBreaks = (text: string) => {
    return text.split("[[BR]]").map((part, index) => (
      <React.Fragment key={index}>
        <span>{part.trim()}</span>
        <br />
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md h-[680px] pt-0 bg-[#1E2B66] shadow-[10px_10px_10px_rgba(0,0,0,0.1)] box-border overflow-hidden mx-auto border-none flex flex-col">
      <CardHeader className="p-2 h-[280px]">
        {url ? (
          <YouTubeEmbed link={url} className="w-full h-[40vh]" onPlay={onPlay} />
        ) : (
          <Image
            src={ReviewCardImg}
            alt="hero-bg"
            width={400}
            height={150}
            className="w-full h-full object-cover rounded-t-lg box-border cursor-pointer"
          />
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex flex-col justify-start">
        <CardTitle className="text-base sm:text-lg text-white font-semibold mb-2 sm:mb-5">
          {title}
        </CardTitle>
        <CardDescription className="text-white text-xs sm:text-sm overflow-auto">
          {renderDescriptionWithBreaks(description)}
        </CardDescription>
      </CardContent>
    </Card>

  )
}

export default ReviewCard;
