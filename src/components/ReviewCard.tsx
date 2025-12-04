import React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import ReviewCardImg from "@/assets/images/reviewcard-img.png";
import YouTubeEmbed from "./YouTubeEmbed";

interface ReviewCardProps {
  url: string;
  title: string;
  // description: string;
  onPlay?: () => void;
}

const ReviewCard = ({ url, title, onPlay }: ReviewCardProps) => {

  // const renderDescriptionWithBreaks = (text: string) => {
  //   return text.split("[[BR]]").map((part, index) => (
  //     <React.Fragment key={index}>
  //       <span>{part.trim()}</span>
  //       <br />
  //       <br />
  //     </React.Fragment>
  //   ));
  // };

  return (
    <Card className="group relative w-full max-w-[280px] aspect-[9/16] bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-2xl overflow-hidden mx-auto border-none rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* Video Background - Full Card */}
      <div className="absolute inset-0 w-full h-full">
        {url ? (
          <YouTubeEmbed link={url} className="w-full h-full" onPlay={onPlay} />
        ) : (
          <Image
            src={ReviewCardImg}
            alt="hero-bg"
            fill
            className="object-cover cursor-pointer"
          />
        )}
      </div>

      {/* Dark Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Content Overlay - Bottom */}
      <CardContent className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <CardTitle className="text-white text-lg font-bold mb-2 drop-shadow-lg line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="text-white/90 text-sm drop-shadow-md line-clamp-3">
          {/* {renderDescriptionWithBreaks(description)} */}
        </CardDescription>
      </CardContent>

      {/* Play Icon Indicator (appears on hover if not playing) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </Card>

  )
}

export default ReviewCard;
