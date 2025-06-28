"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useLang } from "@/context/LangContext";
import { Skeleton } from "@/components/ui/skeleton";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import NoImage from "@/assets/images/noimage.webp";
import { useTranslated } from "@/hooks/useTranslated";

// type LangKey = "uz" | "ru" | "en";

export default function ProductsListPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { lang } = useLang();
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", lang],
    queryFn: () => apiClient.getAllProducts(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const localized = useTranslated(products);

  if (isLoading || !products) {
    return (
      <div className="py-32 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <Card key={idx} className="p-4">
            <Skeleton className="h-[200px] w-full rounded-lg mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (!isMounted) return null;

  return (
    <div className="pt-32 pb-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-10 text-center">
        {t("nav.products", "Mahsulotlar")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: GetOneProductType) => {
          // const localized = product?.[lang as LangKey] || product?.uz;

          return (
            <Card
              key={product.id}
              className="cursor-pointer transition-all hover:shadow-xl"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <CardHeader className="p-0">
                <div className="relative w-full h-[200px] overflow-hidden">
                  <Image
                    src={product.imageUrls?.[0] || NoImage}
                    alt={localized?.name || "Product Image"}
                    fill
                    className="object-contain rounded-t-xl p-3"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {localized?.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {localized?.description}
                </p>
                <p className="text-base mb-5 text-gray-500">
                  {product.slug}
                </p>
                <p className="text-base font-bold mb-7">
                  {formatPrice(product.price)} {t("common.sum")}
                </p>
                <Link
                  href={`/product/${product.id}`}
                  className="px-4 py-2 text-white rounded bg-[#218A4F] hover:bg-[#365343] transition-all"
                >
                  {t("common.more")}
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
