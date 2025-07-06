import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  link: string;
  className?: string;
  onPlay?: () => void;
}

export default function YouTubeEmbed({ link, className, onPlay }: Props) {

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin.includes("youtube.com") && typeof event.data === "object") {
        if (event.data.event === "onStateChange" && event.data.info === 1) {
          onPlay?.();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onPlay]);


  return (
    <div className={cn("aspect-video overflow-hidden rounded-lg", className)}>
      <iframe
        ref={iframeRef}
        src={convertToEmbedUrl(link)}
        title="YouTube video player"
        allowFullScreen
        className="w-full h-full border-0"
      ></iframe>
    </div>
  );
}

function convertToEmbedUrl(link: string): string {
  try {
    const url = new URL(link);

    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else if (url.hostname.includes("youtube.com") || url.hostname.includes("www.youtube.com")) {
      if (url.pathname.startsWith("/watch")) {
        videoId = url.searchParams.get("v") || "";
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
  } catch {
    return link;
  }

  return link;
}