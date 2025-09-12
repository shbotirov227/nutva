"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import NoImage from "@/assets/images/noimage.webp";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";
import { GetOneProductType } from "@/types/products/getOneProduct";
// import { ProductName } from "@/types/enums";
import { FormModal } from "./FormModal";
import { useLang } from "@/context/LangContext";
import { BadgeCheck, Leaf, Truck, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
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
  const { addToCart } = useCart();
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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity: 1 });
    toast.success(t("product.addedToCart"), {
      position: "top-center",
      autoClose: 1200,
    });
  };

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
      {/* Floating Add to Cart icon */}
      {product ? (
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={t("product.addToCart")}
          className="absolute top-3 right-3 z-20 rounded-full bg-white text-slate-900 p-2 lg:p-2.5 shadow-md hover:shadow-lg ring-1 ring-black/5"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      ) : null}

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
        
