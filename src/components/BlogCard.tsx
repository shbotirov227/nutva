"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { BlogMediaType } from "@/types/blogs/getOneBlog";
import DefaultImg from "@/assets/images/default-img.png";
import { useTranslation } from "react-i18next";
import { useLang } from "@/context/LangContext";

type BlogCardProps = {
  id: string;
  imgUrl?: string; // not used directly, media.url covers it — kept for BC
  media: BlogMediaType | null;
  title: string;
  content: string;
  icon?: boolean;
};

/* Utils */
function ytId(url: string) {
  try {
    const u = new URL(url.replace("youtu.be/", "www.youtube.com/watch?v="));
    const v = u.searchParams.get("v");
    if (v) return v;
    const path = u.pathname.split("/").filter(Boolean);
    return path[path.length - 1] || null;
  } catch {
    return null;
  }
}
function youTubeThumb(url: string) {
  const id = ytId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

const BlogCard = ({ id, media, title, content }: BlogCardProps) => {
  const { t } = useTranslation();
  const { lang } = useLang();
  const isYouTube = media?.mediaType === "YoutubeUrl" && !!media.url;
  const isImage =
    media?.mediaType === "Image" || media?.mediaType === "ImageUrl";

  const cover =
    (isYouTube && youTubeThumb(media!.url!)) ||
    (isImage && media?.url) ||
    (DefaultImg as unknown as string);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        className={[
          "relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white/85 shadow-xl backdrop-blur",
          "transition-transform duration-300 will-change-transform",
          "group",
        ].join(" ")}
      >
        {/* Gradient ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.35), rgba(59,130,246,0.20))",
            mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            WebkitMask:
              "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          }}
        />

        {/* Media */}
        <Link
          href={`/${lang}/blog/${id}`}
          className="relative block overflow-hidden rounded-b-none"
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={cover || (DefaultImg as unknown as string)}
              alt={media?.altText || "Blog cover"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              priority={false}
            />

            {/* Play overlay for YouTube */}
            {isYouTube && (
              <div className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
                <PlayCircle className="w-14 h-14 text-white drop-shadow-lg opacity-90 group-hover:scale-105 transition-transform" />
              </div>
            )}
          </div>
        </Link>

        {/* Body */}
        <CardHeader className="px-5 pt-4 pb-1">
          <CardTitle>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 leading-snug line-clamp-2">
              {title}
            </h2>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 pb-2">
          <p className="text-[15px] sm:text-base text-emerald-900/80 leading-relaxed line-clamp-3">
            {content}
          </p>
        </CardContent>

        <CardFooter className="px-5 pb-5">
          <Link
            href={`/${lang}/blog/${id}`}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow-md transition-all
                       bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95"
            aria-label={t("common.more") as string}
          >
            {t("common.more")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </CardFooter>

        {/* Corner chip */}
        <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-emerald-900 shadow">
          {t("common.nutvaNews")}
        </div>
      </Card>
    </motion.article>
  );
};

export default BlogCard;
