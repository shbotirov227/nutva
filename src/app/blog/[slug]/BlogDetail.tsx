"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslated } from "@/hooks/useTranslated";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
// import { useLang } from "@/context/LangContext";

export default function BlogDetail({ blog }: { blog: GetOneBlogType }) {
  const [mounted, setMounted] = useState(false);
  const localized = useTranslated(blog);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !localized) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">{localized.title}</h1>

      {blog?.createdAt && (
        <p className="text-gray-500 text-sm">
          {new Date(blog?.createdAt).toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {blog?.media?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blog?.media.map((media, index) => (
            <Image
              key={index}
              src={
                media?.url.startsWith("http")
                  ? media?.url
                  : `https://www.api.nutvahealth.uz/uploads/${media?.url}`
              }
              alt={media?.altText || `Image ${index + 1}`}
              width={500}
              height={300}
              className="w-full max-h-[400px] object-cover rounded"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {localized?.content ? (
        <div
          className="prose max-w-none prose-lg"
          dangerouslySetInnerHTML={{ __html: localized?.content }}
        />
      ) : (
        <p className="text-red-500 font-semibold">Kontent mavjud emas.</p>
      )}

      {localized?.metaKeywords && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Meta Keywords:</h2>
          <p className="text-gray-600">{localized?.metaKeywords}</p>
        </div>
      )}
    </div>
  );
}
