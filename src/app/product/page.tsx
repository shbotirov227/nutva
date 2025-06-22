"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useLang } from "@/context/LangContext";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="p-4 rounded-xl bg-gray-200 border border-gray-300 shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)] min-h-[350px] flex flex-col pt-32 max-w-4xl mx-auto px-4">
      <Skeleton className=" h-10 w-1/3 mb-6" />
      <Skeleton className=" h-6 w-full mb-3" />
      <Skeleton className=" h-6 w-5/6 mb-3" />
      <Skeleton className=" h-6 w-4/6 mb-3" />
      <Skeleton className=" h-[200px] w-full rounded-xl mt-6" />
    </div>
  );
}
