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
  Sparkles,
  ShoppingCart,
  ChevronRight,
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

type P = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrls?: string[];
  price?: number;
  // ixtiyoriy: agar backendda eski narx bo‘lsa −% ko‘rsatamiz
  oldPrice?: number;
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
              const cover = product.imageUrls?.[0] || (NoImage as unknown as string);

              const pct =
                product.oldPrice && product.price && product.oldPrice > product.price
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : null;

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

                    {/* Discount / trust badge */}
                    <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
                      {pct ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 text-white px-2.5 py-1 text-xs font-bold shadow-md">
                          <Sparkles className="w-3.5 h-3.5" />
                          −{pct}%
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-emerald-900 px-2.5 py-1 text-[11px] font-semibold shadow">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Rasmiy mahsulot
                      </span>
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
                        className="object-contain p-4"
                        onClick={() => router.push(`/product/${product.id}`)}
                      />
                    </motion.div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <Link
                      href={`/product/${product.id}`}
                      className="block text-emerald-900 font-bold text-lg leading-snug hover:underline underline-offset-4 line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-emerald-700/80 text-sm mt-1 line-clamp-1">{product.slug}</p>

                    <p className="text-[15px] text-emerald-900/90 mt-3 line-clamp-2">
                      {product.description}
                    </p>

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
                        <Leaf className="w-4 h-4" /> 100% tabiiy
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> GMP
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Truck className="w-4 h-4" /> Tez yetkazish
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="mt-5 flex gap-2">
                      <Button
                        size="lg"
                        className="group flex-1 font-bold"
                        style={{
                          background: "linear-gradient(90deg, #10B981, #34D399)",
                          color: "#fff",
                        }}
                        onClick={() => router.push(`/product/${product.id}`)}
                        aria-label={`${product.name} haqida batafsil`}
                      >
                        {t("common.more")}
                        <ChevronRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => handleAdd(product)}
                        className="flex-1 border-emerald-300 text-emerald-900 hover:bg-emerald-50 font-semibold"
                        aria-label={`${product.name} savatga qo‘shish`}
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
