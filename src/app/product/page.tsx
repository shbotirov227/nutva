"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useLang } from "@/context/LangContext";

export default function ProductsPage() {
  const router = useRouter();
  const { lang } = useLang();

  const { data: products = [] } = useQuery({
    queryKey: ["products", lang],
    queryFn: () => apiClient.getAllProducts(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (products.length > 0) {
      router.replace(`/product/${products[0].id}`);
    }
  }, [products, router]);

  return <p className="pt-32 text-center">Yuklanmoqda...</p>;
}
