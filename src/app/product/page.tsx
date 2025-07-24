"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useLang } from "@/context/LangContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import NoImage from "@/assets/images/noimage.webp";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import EmptyCartImg from "@/assets/images/empty-cart-img.png";
import Container from "@/components/Container";

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

  // ✅ JSON-LD schema data
  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nutva Complex",
      "image": "https://nutva.uz/uploads/50e5ef67-c673-4e4f-b7ab-29b7ecb72e77.png",
      "description": "Nutva Complex – bu bo‘g‘imlarda og‘riq, qattiqlik, yallig‘lanish va suyak mo‘rtlashuvi bilan kurashishda yordam beruvchi zamonaviy biofaol qo'shimcha. Maxsus tanlangan tarkibi tufayli u koksartroz, gonartroz, osteoporoz, poliartrit, umurtqa churrasi (grija) kabi holatlarda organizmga ko‘p yo‘nalishda qo‘llab-quvvatlovchi ta’sir ko‘rsatadi.",
      "brand": { "@type": "Brand", "name": "Nutva Pharm" },
      "sku": "nutva-complex",
      "offers": {
        "@type": "Offer",
        "url": "https://nutva.uz/product/2ca86164-5e10-449d-a854-b80f0173a3f5",
        "priceCurrency": "UZS",
        "price": "1170000",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nutva Complex Extra",
      "image": "https://nutva.uz/uploads/0391ee35-edc3-4024-acd1-1eb5a937d8ff.png",
      "description": "Nutva Complex Extra – bu organizm quvvatini tiklash, immunitetni mustahkamlash va oshqozon osti, jigar, ichak tizimlarining muvozanatini saqlashga qaratilgan kuchli tabiiy biofaol qo'shimchadir.",
      "brand": { "@type": "Brand", "name": "Nutva Pharm" },
      "sku": "nutva-complex-extra",
      "offers": {
        "@type": "Offer",
        "url": "https://nutva.uz/product/0406b946-cd9a-4171-91e2-e9f3e3016596",
        "priceCurrency": "UZS",
        "price": "1170000",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Gelmin Kids",
      "image": "https://nutva.uz/uploads/3e775e62-1f46-4706-852f-84f0bb143d2d.png",
      "description": "Gelmin Kids – bu bolalar organizmi uchun mo‘ljallangan, tabiiy o‘simliklar asosida ishlab chiqilgan, parazitlarga qarshi biofaol qo'shimchadir. U ichki tozalanishni qo‘llab-quvvatlaydi, gijja va boshqa parazitlarni chiqarishga yordam beradi, hazmni yaxshilaydi, ishtaha va uyquni tiklaydi.",
      "brand": { "@type": "Brand", "name": "Nutva Pharm" },
      "sku": "gelmin-kids",
      "offers": {
        "@type": "Offer",
        "url": "https://nutva.uz/product/f3146c53-0e85-49d3-8a8f-017fc7baa97c",
        "priceCurrency": "UZS",
        "price": "490000",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Viris Men",
      "image": "https://nutva.uz/uploads/714ba2fb-c1df-4dbc-b372-dce236bf5e11.png",
      "description": "Nutva Viris Men – bu zamonaviy erkak organizmi ehtiyojlarini hisobga olgan holda ishlab chiqilgan tabiiy biofaol qo'shimcha. U immunitet, quvvat, jinsiy gormonal balans va prostata faoliyatini birgalikda qo‘llab-quvvatlashga mo‘ljallangan. ",
      "brand": { "@type": "Brand", "name": "Nutva Pharm" },
      "sku": "viris-men",
      "offers": {
        "@type": "Offer",
        "url": "https://nutva.uz/product/09de8997-9a58-429d-ba9f-8ac06c6dac05",
        "priceCurrency": "UZS",
        "price": "860000",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Fertilia Women",
      "image": "https://nutva.uz/uploads/3fb58593-e443-48f8-8488-5dd13b1665cd.png",
      "description": "Nutva Fertilia Women – bu ayol organizmining tabiiy ritmini, gormonal muvozanatini va reproduktiv salomatligini kompleks tarzda qo‘llab-quvvatlaydigan biofaol qo‘shimcha. Mahsulot homiladorlikni rejalashtirayotgan, hayz davri buzilgan, gormonal nomutanosiblikdan aziyat chekayotgan yoki D, B guruhi vitaminlariga ehtiyoji bor ayollar uchun ayni muddao.",
      "brand": { "@type": "Brand", "name": "Nutva Pharm" },
      "sku": "fertilia-women",
      "offers": {
        "@type": "Offer",
        "url": "https://nutva.uz/product/fcda59dd-a987-483b-9f82-9d937b004807",
        "priceCurrency": "UZS",
        "price": "860000",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    }
  ];

  return (
    <>
      {/* ✅ SEO Schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* ✅ UI */}
      <Container className="pt-32 pb-16  px-4">
        {products?.length > 0 ? (
          <>
            <h1 className="text-3xl font-bold mb-10 text-center text-green-900">
              {t("nav.products", "Mahsulotlar")}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-10">
              {products.map((product) => {
                const handleAdd = () => {
                  addToCart({ ...product, quantity: 1 });
                  toast.success(t("product.addedToCart"), {
                    position: "top-center",
                    autoClose: 1200,
                  });
                };

                return (
                  <Card key={product.id} className="transition-all hover:shadow-xl">
                    <CardHeader className="p-0">
                      <div className="relative w-full h-[200px] overflow-hidden">
                        <Image
                          src={product.imageUrls?.[0] || NoImage}
                          alt={product?.name || "Product Image"}
                          fill
                          className="object-contain cursor-pointer rounded-t-xl p-3"
                          onClick={() => router.push(`/product/${product.id}`)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-t-2">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {product?.name}
                      </CardTitle>
                      <p className="text-base mb-3 text-gray-500">
                        {product?.slug}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 my-4">
                        {product?.description}
                      </p>
                      <p className="text-base font-bold text-[#218A4F]">
                        {formatPrice(product.price)} {t("common.sum")}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Link
                        href={`/product/${product.id}`}
                        className="w-full text-center px-4 py-2 border border-[#218A4F] text-[#218A4F] rounded-lg hover:bg-green-900 hover:text-white transition-all text-sm"
                      >
                        {t("common.more")}
                      </Link>
                      <Button
                        size={"lg"}
                        onClick={handleAdd}
                        className="w-full whitespace-nowrap cursor-pointer bg-green-700 hover:bg-green-900 text-sm py-4"
                      >
                        {t("product.addToCart")}
                      </Button>
                    </CardFooter>
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
    </>
  );
}
