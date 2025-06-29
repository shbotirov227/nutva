"use client";

import Container from "@/components/Container";
import Image from "next/image";
// import { notFound } from "next/navigation";
// import { Metadata } from "next";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { useTranslated } from "@/hooks/useTranslated";

export default function BlogPostPage() {
  const params = useParams();
  const { t } = useTranslation();

  const { data: blog } = useQuery({
    queryKey: ["blog", params.slug],
    queryFn: () => apiClient.getOneBlog(params.slug as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const localized = useTranslated(blog);

  return (
    <Container className="pt-32">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{localized?.title}</h1>

        {blog?.createdAt && (
          <p className="text-gray-500 text-sm">
            {new Date(blog?.createdAt).toLocaleDateString("uz-UZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {blog?.media?.length !== 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* {blog.imageUrls.map((img: string, index: number) => (
              <Image
                key={index}
                src={
                  img.startsWith("http")
                    ? img
                    : `https://www.nutvahealth.uz/uploads/${img}`
                }
                alt={`Blog Image ${index + 1}`}
                className="w-full max-h-[400px] object-cover rounded"
                width={500}
                height={300}
                loading="lazy"
              />
            ))} */}
          </div>
        )}
      </div>
    </Container>
  );
}
