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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import NoImage from "@/assets/images/noimage.webp";
import { useTranslated } from "@/hooks/useTranslated";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

// type LangKey = "uz" | "ru" | "en";

export default function ProductsListPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { lang } = useLang();
  const { t } = useTranslation();
  const { addToCart } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", lang],
    queryFn: () => apiClient.getAllProducts(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // if (!products) return null;

  const localized = useTranslated(products);
  console.log("Localized:", localized);

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

  // const handleAdd = () => {
  //   addToCart({ ...localized, quantity: 1 });
  //   toast.success("Product added to cart!");
  // };

  if (!isMounted) return null;

  return (
    <div className="pt-32 pb-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-10 text-center">
        {t("nav.products", "Mahsulotlar")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          // const localized = product?.[lang as LangKey] || product?.uz;
          const handleAdd = () => {
            addToCart({
              ...product,
              quantity: 1,
            });
            toast.success(t("product.addedToCart"), {
              position: "top-center",
              autoClose: 1200,
            });
          };

          return (
            <Card
              key={product.id}
              className="transition-all hover:shadow-xl"
            // onClick={() => router.push(`/product/${product.id}`)}
            >
              <CardHeader className="p-0">
                <div className="relative w-full h-[200px] overflow-hidden">
                  <Image
                    src={product.imageUrls?.[0] || NoImage}
                    alt={localized?.name || "Product Image"}
                    fill
                    className="object-contain cursor-pointer rounded-t-xl p-3"
                    onClick={() => router.push(`/product/${product.id}`)}
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
                  {product?.slug}
                </p>
                <p className="text-base font-bold mb-7">
                  {formatPrice(product.price)} {t("common.sum")}
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/product/${product.id}`}
                    className="px-6 py-2 text-white rounded-lg bg-[#218A4F] hover:bg-[#365343] transition-all"
                  >
                    {t("common.more")}
                  </Link>

                  <Button
                    size={"lg"}
                    onClick={handleAdd}
                    className="cursor-pointer bg-[#218A4F] hover:bg-[#365343]"
                  >
                    {t("product.addToCart")}
                  </Button>
                </div>

              </CardContent>
            </Card>

            // <ProductCard
            //   key={product.id}
            //   id={product.id}
            //   title={localized.title}
            //   slug={product.slug}
            //   bgColor={localized.bgColor}
            //   description={localized.description}
            //   image={localized.image}
            //   className="transition-all hover:shadow-xl"
            //   addToCart={handleAdd}
            // />
          );
        })}
      </div>
    </div >
  );
}
