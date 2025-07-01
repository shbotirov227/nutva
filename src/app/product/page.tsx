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
import Container from "@/components/Container";
import EmptyCartImg from "@/assets/images/empty-cart-img.png";

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
    <Container className="pt-32 pb-16 max-w-7xl mx-auto px-4">
      {products?.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold mb-10 text-center">
            {t("nav.products", "Mahsulotlar")}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
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
                  className="transition-all hover:shadow-xl p-0"
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
                    <p className="text-base mb-3 text-gray-500">
                      {product?.slug}
                    </p>
                    <p className="text-base font-bold text-[#218A4F] mb-5">
                      {formatPrice(product.price)} {t("common.sum")}
                    </p>

                    <div className="flex flex-col gap-2 mt-auto">
                      <Link
                        href={`/product/${product.id}`}
                        className="w-full text-center px-4 py-2 border border-[#218A4F] text-[#218A4F] rounded-lg hover:bg-[#218A4F] hover:text-white transition-all text-sm"
                      >
                        {t("common.more")}
                      </Link>
                      <Button
                        onClick={handleAdd}
                        className="w-full whitespace-nowrap bg-black cursor-pointer hover:bg-neutral-800 text-sm"
                      >
                        {t("product.addToCart")}
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div>
          <Image
            src={EmptyCartImg}
            alt="No image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full m-auto max-w-[350px] h-full object-contain rounded-xl border shadow-none border-none"
          />
          <p className="text-muted-foreground text-xl text-center mt-10">{t("errors.emptyProducts")}</p>
        </div>
      )}
    </Container>
  );
}
