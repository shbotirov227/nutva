"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import NoImage from "@/assets/images/noimage.webp";
import { Button } from "./ui/button";
import { GetOneProductType } from "@/types/products/getOneProduct";
// import { ProductName } from "@/types/enums";
import { FormModal } from "./FormModal";
import { useLang } from "@/context/LangContext";
import { BadgeCheck, Leaf, Truck, Star } from "lucide-react";
import { getFirstNormalizedImage } from "@/lib/imageUtils";

type ProductCardProps = {
  id: string;
  title: string;
  slug: string;
  bgColor?: string;
  description: string;
  price?: number;
  image: string[];
  className?: string;
  style?: React.CSSProperties;
  imagePriority?: boolean;
  index?: number;
  activeColor?: string;
  addToCart?: () => void; // not used (context addToCart is used)
  product?: GetOneProductType;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  slug,
  bgColor,
  description,
  image,
  className,
  style,
  imagePriority,
  index,
  activeColor,
  product,
}) => {
  const { t } = useTranslation();
  const { lang } = useLang();

  // Accent colors and dynamic styles (per-card stable and distinct)
  const hashHue = (str: string) => {
    let acc = 0;
    for (let i = 0; i < str.length; i++) acc = (acc * 31 + str.charCodeAt(i)) >>> 0;
    return acc % 360;
  };
  const baseKey = id || slug || title || "nutva";
  const hue = !activeColor && !bgColor ? hashHue(baseKey) : null;
  const accentColor = activeColor || bgColor || (hue !== null ? `hsl(${hue} 65% 46%)` : "hsl(160 65% 46%)");
  const accentColorDark = activeColor || bgColor || (hue !== null ? `hsl(${(hue + 12) % 360} 65% 36%)` : "hsl(160 65% 36%)");
  const toAlpha = (hsl: string, a: number) => hsl.replace("hsl", "hsla").replace(")", `, ${a})`);
  const buttonGradient = `linear-gradient(90deg, ${accentColor}, ${accentColorDark})`;

  // Reviews info by product title (same as ProductsClient)
  const getReviewInfo = () => {
    if (!product) return { rating: 4.8, count: 96 };
    const lowerTitle = product.name.toLowerCase();
    
    if (lowerTitle.includes("extra")) {
      return { rating: 4.8, count: 187 };
    }
    
    if (lowerTitle.includes("complex") && !lowerTitle.includes("extra")) {
      return { rating: 4.9, count: 321 };
    }
    
    if (lowerTitle.includes("gelmin")) {
      return { rating: 4.7, count: 214 };
    }
    
    return { rating: 4.8, count: 96 };
  };

  const reviewInfo = getReviewInfo();

  // Get XIT badge info (same logic as ProductsClient)
  const getHighlightBadge = () => {
    if (!product) return null;
    const normalized = product.name.toLowerCase();

    if (normalized.includes("complex extra")) {
      return { type: "hit" as const, value: 45 };
    }

    if (normalized.includes("gelmin kids")) {
      return { type: "hit" as const, value: 55 };
    }

    if (normalized.includes("complex")) {
      return { type: "hit" as const, value: 50 };
    }

    return null;
  };

  const titleHighlight = getHighlightBadge();

  return (
    <div
      style={{ ...style }}
      className={
        `group relative w-full max-[1024px]:w-[500px] min-h-[420px] ` +
        `flex flex-col-reverse lg:flex-row items-center justify-between ` +
        `rounded-2xl border border-white/15 shadow-2xl overflow-hidden ` +
        `backdrop-blur-[6px] bg-white/5 ${className ?? ""}`
      }
    >
      {/* XIT Badge - Top Right */}
      {titleHighlight?.type === "hit" && (
        <div className="absolute top-0 right-3 z-20">
          <div className="relative inline-block">
            {/* SVG Flag/Bookmark Badge with dynamic color */}
            <svg width="65" height="85" viewBox="0 0 70 90" className="drop-shadow-lg">
              <path
                d="M 5,0 L 65,0 C 67.76,0 70,2.24 70,5 L 70,90 L 35,75 L 0,90 L 0,5 C 0,2.24 2.24,0 5,0 Z"
                fill={accentColor}
              />
            </svg>
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-3 text-white font-bold">
              <div className="text-[11px] tracking-wider">{t("product.hit", lang === "uz" ? "XIT" : lang === "ru" ? "ХИТ" : "HIT")}</div>
              <div className="text-lg leading-tight mt-0.5">-{titleHighlight.value}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient glow frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${toAlpha(accentColor, 0.4)}, rgba(59,130,246,0.25))`,
          mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          WebkitMask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          padding: 1,
        }}
      />

      {/* Left content */}
  <div className="relative z-10 w-full px-6 pt-6 pb-10 lg:text-left flex flex-col gap-5">
        <div>
          <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow mb-3">{title}</h2>
          <span className="text-white/90 text-lg sm:text-xl mb-3 block">{slug}</span>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">{description}</p>
          
          {/* Reviews Stars */}
          {product && (
            <div className="mt-4 flex items-center gap-2 text-sm text-white/90">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="font-semibold tabular-nums">
                {reviewInfo.rating.toFixed(1)}
              </span>
              <span className="text-white/70">
                · {reviewInfo.count}+ {t("product.reviews", "izohlar")}
              </span>
            </div>
          )}
        </div>

        {product ? (
          <div className="mt-3 flex flex-col sm:flex-row justify-center lg:justify-start items-stretch sm:items-center gap-3">
            <FormModal products={[{ productId: product.id, quantity: 1 }]}> 
              <Button
                size="lg"
                className="font-bold px-6 py-2 rounded-lg transition-all w-full sm:w-auto text-center cursor-pointer shadow-lg hover:shadow-xl"
                style={{ background: buttonGradient, color: "#fff" }}
              >
                {t("common.buy")}
              </Button>
            </FormModal>

            <Link href={`/${lang}/product/${id}`} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-center cursor-pointer bg-white text-slate-900 hover:bg-white/90 shadow-sm"
              >
                {t("common.more")}
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-white text-lg md:text:xl font-semibold">{t("common.soon")}</h2>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-white/90">
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
            <BadgeCheck className="w-4 h-4" /> {t("product.halal", "Halal")}
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
            <Leaf className="w-4 h-4" /> {t("product.natural")}
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
            <Truck className="w-4 h-4" /> {t("product.fastDelivery")}
          </span>
        </div>
      </div>

      {/* Right product image with accents */}
      <div className="relative w-full lg:w-[45%] flex justify-center items-center p-6 pt-10 lg:pt-6">
        {/* Accent blobs */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-40" style={{ background: accentColor }} />
        <div className="absolute right-0 bottom-0 h-28 w-28 rounded-full blur-2xl opacity-30" style={{ background: accentColor }} />

        {image?.length > 0 ? (
          <Image
            src={getFirstNormalizedImage(image, NoImage.src)}
            alt={`${title} — Nutva`}
            width={0}
            height={0}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="w-full min-w-[260px] max-w-[420px] h-56 object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            loading={index === 0 ? "eager" : "lazy"}
            priority={imagePriority}
            decoding="async"
          />
        ) : (
          <Image
            src={NoImage}
            alt="No Image"
            width={0}
            height={0}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="w-full max-w-[320px] h-56 object-contain"
            loading={index === 0 ? "eager" : "lazy"}
            priority={imagePriority}
            decoding="async"
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
        
