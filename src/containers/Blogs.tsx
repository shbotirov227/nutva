"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { GetAllBlogsType } from "@/types/blogs/getAllBlogs";
import BlogCard from "@/components/BlogCard";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useTranslated } from "@/hooks/useTranslated";

type ButtonType = "popular" | "latest";

const ActiveButton = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      variant="default"
      size="lg"
      className={clsx(
        "bg-transparent text-lg p-5 border border-[#218A4F] text-[#218A4F] hover:bg-[#365343] hover:text-white transition-all cursor-pointer",
        {
          "bg-[#218A4F]": isActive,
          "text-white": isActive,
        }
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const Blogs = () => {
  const [active, setActive] = useState<ButtonType>("popular");
  const [mounted, setMounted] = useState(false);
  const { lang } = useLang();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: blogs = [] as GetAllBlogsType, isLoading } = useQuery({
    queryKey: ["blogs", lang],
    queryFn: () => apiClient.getAllBlogs(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const filteredBlogs = [...blogs]
    .sort((a, b) => {
      if (active === "popular") {
        return (b.views ?? 0) - (a.views ?? 0);
      } else {
        return (
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
      }
    })
    .slice(0, 4);



  const translatedBlogs = useTranslated(filteredBlogs);

  console.log("translated", translatedBlogs);


  if (!mounted) return null;

  return (
    blogs.length > 0 ? (
      <Container className="px-4 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-8">
          <h1 className="text-4xl font-bold mb-4 text-[#218A4F] text-center md:text-left">
            {t("common.blogs")}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <ActiveButton
              isActive={active === "popular"}
              onClick={() => setActive("popular")}
            >
              {t("blog.popular")}
            </ActiveButton>
            <ActiveButton
              isActive={active === "latest"}
              onClick={() => setActive("latest")}
            >
              {t("blog.latest")}
            </ActiveButton>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-[300px] rounded-xl flex flex-col gap-4 p-4 bg-gray-200 border border-gray-300 shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)]"
              >
                <Skeleton className="w-full h-[180px] rounded-md" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {translatedBlogs?.map((blog) => {
                if (!blog || !blog?.id) return null;

                return (
                  <motion.div
                    key={blog?.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full rounded-xl flex flex-col gap-4 px-5"
                  >
                    <BlogCard
                      id={blog?.id}
                      // imgUrl={blog?.media?.[0] || ""}
                      title={blog?.title}
                      content={blog?.content}
                      media={blog?.media[0] || null}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </Container>
    ) : null
  );
};

const BlogsComponent = React.memo(Blogs);
Blogs.displayName = "Blogs";

export default BlogsComponent;
