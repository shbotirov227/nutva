import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  link: string;
  className?: string;
  onPlay?: () => void;
}

export default function YouTubeEmbed({ link, className, onPlay }: Props) {
  const [activated, setActivated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = useMemo(() => extractYouTubeId(link), [link]);
  const thumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

  useEffect(() => {
    if (!activated) return;
    type YTMessage = { event?: string; info?: number };
    const handleMessage = (event: MessageEvent) => {
      if (event.origin.includes("youtube.com") && typeof event.data === "object") {
        const data = event.data as YTMessage;
        if (data?.event === "onStateChange" && data?.info === 1) {
          onPlay?.();
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onPlay, activated]);

  if (!videoId) {
    return null;
  }

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-lg bg-black", className)}>
      {!activated && (
        <button
          type="button"
          className="group absolute inset-0 w-full h-full"
          onClick={() => setActivated(true)}
          aria-label="Play video"
        >
          {thumb && (
            <Image
              src={thumb}
              alt="YouTube thumbnail"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          )}
          <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" aria-hidden />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-white/90 group-hover:bg-white w-16 h-16 shadow-lg"
            aria-hidden
          >
            {/* Play triangle */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7L8 5z" fill="#111" />
            </svg>
          </span>
        </button>
      )}
      {activated && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          loading="lazy"
        />
      )}
    </div>
  );
}

function extractYouTubeId(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1) || null;
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/watch")) {
        return url.searchParams.get("v");
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      }
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/embed/")[1]?.split("/")[0] || null;
      }
    }
    return null;
  } catch {
    return null;
  }
}