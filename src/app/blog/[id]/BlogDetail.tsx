"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import BlogsComponent from "@/containers/Blogs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowBigLeftDash, Calendar, Eye } from "lucide-react";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { useLang } from "@/context/LangContext";
import { Button } from "@/components/ui/button";

export default function BlogDetail({ blog: initalBlog, id }: { blog: GetOneBlogType, id: string }) {
  const [mounted, setMounted] = useState(false);
  const [blog, setBlog] = useState<GetOneBlogType>(initalBlog);
  const [loading, setLoading] = useState(false);
  const { lang, isLoading } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${id}?lang=${lang}`,
          {
            cache: "no-store",
          }
        );

        if (response.ok) {
          const newBlog: GetOneBlogType = await response.json();
          setBlog(newBlog);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    const currentLang = searchParams.get('lang') || 'uz';
    if (lang !== currentLang) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('lang', lang);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });

      fetchBlogData();
    }
  }, [lang, isLoading, mounted, id, router, searchParams]);

  if (!mounted || !blog) return null;


  return (
    <div className="space-y-6">
      {/* {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )} */}

      <Button
        onClick={() => {
          router.push("/blog");
        }}
        size={"lg"}
        className="flex items-center text-lg gap-2 cursor-pointer"
      >
        <ArrowBigLeftDash className="size-6" />
        <span>{t("common.goBack")}</span>
      </Button>

      <Card className={`shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)] ${loading ? "opacity-50" : ""}`}>
        <CardHeader className="w-full mx-auto">
          {blog?.media?.length > 0 && (
            <div
              className={clsx(
                "grid gap-4",
                blog.media.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              )}
            >
              {blog.media.map((media, index) => {
                const isExternal = media.url.startsWith("http");
                const mediaUrl = isExternal
                  ? media.url
                  : `https://www.api.nutvahealth.uz/uploads/${media.url}`;

                return (
                  <div
                    key={index}
                    className="w-full aspect-vide rounded overflow-hidden flex items-center justify-center"
                  >
                    {(() => {
                      switch (media.mediaType) {
                        case "Image":
                        case "ImageUrl":
                          return (
                            <Image
                              src={mediaUrl}
                              alt={media.altText || `Image ${index + 1}`}
                              width={800}
                              height={450}
                              className="max-w-full max-h-full object-contain"
                              loading="lazy"
                            />
                          );

                        case "Video":
                          return (
                            <video
                              controls
                              className="w-full h-full object-contain"
                            >
                              <source src={mediaUrl} type="video/mp4" />
                              Sizning brauzeringiz videoni qo‘llab-quvvatlamaydi.
                            </video>
                          );

                        case "YoutubeUrl":
                          return (
                            <YouTubeEmbed
                              link={mediaUrl}
                              className="w-full h-full"
                              onPlay={() => console.log("YouTube video playing")}
                            />
                          );

                        default:
                          return null;
                      }
                    })()}
                  </div>
                );
              })}
            </div>
          )}
        </CardHeader>



        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{blog.title}</h1>

            {blog.viewCount ? (
              <div className="flex items-center justify-center gap-3">
                <Eye size={20} />
                <p className="text-gray-500 text-base">
                  <span className="font-semibold">{blog.viewCount}</span> views
                </p>
              </div>
            ) : null}

            {blog?.createdAt && (
              <div className="flex items-center justify-center gap-3">
                <Calendar size={20} />
                <p className="text-gray-500 text-base">
                  {new Date(blog?.createdAt).toLocaleDateString("uz-UZ", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {blog?.content ? (
            <div
              className="prose max-w-none prose-lg text-base leading-loose"
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            />
          ) : (
            <p className="text-red-500 font-semibold">Kontent mavjud emas.</p>
          )}

          {/* {blog?.metaKeywords && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Meta Keywords:</h2>
            <p className="text-gray-600">{blog?.metaKeywords}</p>
          </div>
        )} */}
        </CardContent>

      </Card>

      <BlogsComponent />
    </div>
  );
}
