"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ShieldCheck,
  Leaf,
  Truck,
  ShoppingCart,
  ChevronRight,
  Star,
} from "lucide-react";

import { apiClient } from "@/lib/apiClient";
import { useLang } from "@/context/LangContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/formatPrice";
import NoImage from "@/assets/images/noimage.webp";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import EmptyCartImg from "@/assets/images/empty-cart-img.png";
import Container from "@/components/Container";
import clsx from "clsx";
import { getFirstNormalizedImage } from "@/lib/imageUtils";

type P = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrls?: string[];
  price?: number;
  // ixtiyoriy: agar backendda eski narx bo'lsa −% ko'rsatamiz
  oldPrice?: number;
};

type HighlightBadge = {
  type: "hit";
  value: number;
};

const getStaticHighlightForTitle = (title: string): HighlightBadge | null => {
  const normalized = title.toLowerCase();

  if (normalized.includes("complex extra")) {
    return { type: "hit", value: 45 };
  }

  if (normalized.includes("gelmin kids")) {
    return { type: "hit", value: 55 };
  }

  if (normalized.includes("complex")) {
    return { type: "hit", value: 50 };
  }

  return null;
};

const getStaticReviewInfoForTitle = (title: string) => {
  const normalized = title.toLowerCase();

  if (normalized.includes("complex extra")) {
    return { rating: 4.8, count: 187 };
  }

  if (normalized.includes("gelmin kids")) {
    return { rating: 4.7, count: 214 };
  }

  if (normalized.includes("complex")) {
    return { rating: 4.9, count: 321 };
  }

  return { rating: 4.8, count: 96 };
};

export default function ProductsClient() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { lang } = useLang();
  const { t } = useTranslation();
  const { addToCart } = useCart();

  useEffect(() => setIsMounted(true), []);

  const { data: products, isLoading } = useQuery<P[]>({
    queryKey: ["products", lang],
    queryFn: () => apiClient.getAllProducts(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const handleAdd = (p: P) => {
    // Only pick the fields required by RawCartItem, and provide defaults for missing ones if necessary
    addToCart({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      price: p.price ?? 0,
      createdAt: "",
      updatedAt: "",
      viewCount: 0,
      buyClickCount: 0,
      imageUrls: p.imageUrls ?? [],
      quantity: 1,
    });
    toast.success(t("product.addedToCart"), {
      position: "top-center",
      autoClose: 1200,
    });
  };

  if (!isMounted) return null;

  if (isLoading || !products) {
    return (
      <div className="py-28 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur"
          >
            <Skeleton className="h-56 w-full rounded-b-none" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Container className="pt-28 pb-16 px-4">
      {products?.length ? (
        <>
          <h1 className="text-3xl font-extrabold mb-8 text-center text-emerald-900 tracking-tight">
            {t("nav.products", "Mahsulotlar")}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {products.map((product) => {
              const cover = getFirstNormalizedImage(product.imageUrls, NoImage.src);

              // const pct =
              //   product.oldPrice && product.price && product.oldPrice > product.price
              //     ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
              //     : null;

              const titleHighlight = getStaticHighlightForTitle(product.name);
              const reviewInfo = getStaticReviewInfoForTitle(product.name);

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={clsx(
                    "group relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white/80 shadow-xl",
                    "backdrop-blur supports-[backdrop-filter]:bg-white/70"
                  )}
                >
                  {/* Gradient border glow */}
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

                  {/* Image header */}
                  <div className="relative h-56 w-full overflow-hidden">
                    {/* Accent blobs */}
                    <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl opacity-40 bg-emerald-400" />
                    <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full blur-2xl opacity-30 bg-emerald-300" />

                    {/* Highlight badge (right) + Halal (left) */}
                    <div className="absolute inset-x-3 right-1 top-1 z-20 flex items-start justify-between gap-3">
                      <span className="inline-flex items-center mt-4 gap-1 rounded-full bg-white/95 text-emerald-900 px-2.5 py-1 text-[11px] font-semibold shadow">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {t("product.halal", "Halal")}
                      </span>

                      <div className="flex flex-col items-end gap-1">
                        {titleHighlight?.type === "hit" && (
                          <div className="absolute -top-1 -right-1 z-10">
                            <div className="relative inline-block">
                              {/* SVG Flag/Bookmark Badge */}
                              <svg width="70" height="90" viewBox="0 0 70 90" className="drop-shadow-lg">
                                <path
                                  d="M 5,0 L 65,0 C 67.76,0 70,2.24 70,5 L 70,90 L 35,75 L 0,90 L 0,5 C 0,2.24 2.24,0 5,0 Z"
                                  fill="#059669"
                                />
                              </svg>
                              {/* Text overlay */}
                              <div className="absolute inset-0 flex flex-col items-center justify-start pt-4 text-white font-bold">
                                <div className="text-xs tracking-wider">ХИТ</div>
                                <div className="text-xl leading-tight mt-1">-{titleHighlight.value}%</div>
                              </div>
                            </div>
                          </div>
                        )}



                        {/* {!titleHighlight && pct ? (
                          <div
                            className="relative bg-emerald-600 text-white px-4 py-2 shadow-lg"
                            style={{
                              clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)",
                              transform: "skewX(-5deg)"
                            }}
                          >
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                            <span className="relative text-xs font-extrabold uppercase tracking-wide" style={{ transform: "skewX(5deg)", display: "inline-block" }}>
                              ХИТ -{pct}%
                            </span>
                          </div>
                        ) : null} */}
                      </div>
                    </div>

                    <motion.div
                      className="relative z-10 h-full w-full"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    >
                      <Image
                        src={cover}
                        alt={`${product.name} — Nutva`}
                        fill
                        priority={false}
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-contain p-4 cursor-pointer"
                        onClick={() => router.push(`/${lang}/product/${product.id}`)}
                      />
                    </motion.div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <Link
                      href={`/${lang}/product/${product.id}`}
                      className="block text-emerald-900 font-bold text-lg leading-snug hover:underline underline-offset-4 line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-emerald-700/80 text-sm mt-1 line-clamp-1">{product.slug}</p>

                    <p className="text-[15px] text-emerald-900/90 mt-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Reviews row (static mapping by title) */}
                    <div className="mt-3 flex items-center gap-2 text-[13px] text-emerald-900/80">
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
                      <span className="text-emerald-800/70">
                        · {reviewInfo.count}+ {t("product.reviews", "izohlar")}
                      </span>
                    </div>

                    {/* Batafsil link */}
                    <div className="mt-3">
                      <button
                        onClick={() => router.push(`/${lang}/product/${product.id}`)}
                        className="group inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer transition-colors"
                        aria-label={`${product.name} haqida batafsil`}
                      >
                        {t("common.more")}
                        <ChevronRight className="ml-0.5 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>

                    {/* Price row */}
                    <div className="mt-4 flex items-end gap-3">
                      {product.price != null && (
                        <div className="text-2xl font-extrabold text-emerald-900 tabular-nums">
                          {formatPrice(product.price)} {t("common.sum")}
                        </div>
                      )}
                      {product.oldPrice && product.oldPrice > (product.price ?? 0) && (
                        <div className="text-sm text-emerald-800/60 line-through tabular-nums">
                          {formatPrice(product.oldPrice)} {t("common.sum")}
                        </div>
                      )}
                    </div>

                    {/* Trust row */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-emerald-900/80">
                      <span className="inline-flex items-center gap-1">
                        <Leaf className="w-4 h-4" /> {t("product.natural", "100% tabiiy")}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> ISO
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Truck className="w-4 h-4" /> {t("product.fastDelivery", "Tez yetkazish")}
                      </span>
                    </div>

                    {/* Savatga qo'shish button */}
                    <div className="mt-4">
                      <Button
                        size="lg"
                        onClick={() => handleAdd(product)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer h-12"
                        aria-label={`${product.name} savatga qo'shish`}
                      >
                        <ShoppingCart className="mr-2 w-5 h-5" />
                        {t("product.addToCart")}
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <Image
            src={EmptyCartImg}
            alt="No image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full m-auto max-w-[350px] h-full object-contain rounded-xl border-none"
          />
          <p className="text-muted-foreground text-xl text-center mt-10">
            {t("errors.emptyProducts")}
          </p>
        </div>
      )}
    </Container>
  );
}
