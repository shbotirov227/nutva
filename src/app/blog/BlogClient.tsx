"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

import BlogCard from "@/components/BlogCard";
import Container from "@/components/Container";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
// import EmptyCartImg from "@/assets/images/empty-cart-img.png";
import { GetAllBlogsType } from "@/types/blogs/getAllBlogs";
// import { useTranslated } from "@/hooks/useTranslated";
// import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import Image from "next/image";
import EmptyCartImg from "@/assets/images/empty-cart-img.png";

export default function BlogClient() {
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const { lang } = useLang();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: blogs = [], isLoading } = useQuery<GetAllBlogsType>({
    queryKey: ["blogs", lang],
    queryFn: () => apiClient.getAllBlogs(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // const translatedBlogs = useTranslated(blogs);

  const filteredBlogs = blogs
    .filter((blog: GetOneBlogType & { title: string; subtitle: string; content: string; metaKeywords: string }) => {
      const matchSearch =
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase());

      const matchDate = selectedDate
        ? new Date(blog.createdAt!).toDateString() === selectedDate.toDateString()
        : true;

      const matchCategory = selectedCats.length
        ? selectedCats.every((cat) => blog.metaKeywords.toLowerCase().includes(cat))
        : true;

      return matchSearch && matchDate && matchCategory;
    })
    .slice(0, visibleCount);

  if (!mounted) return null;

  return (
    <div className="pt-32 pb-25">
      <Container>
        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedCats={selectedCats}
          setSelectedCats={setSelectedCats}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-[300px] rounded-xl flex flex-col gap-4 p-4 bg-gray-200"
              >
                <Skeleton className="w-full h-[180px] rounded-md" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl flex flex-col gap-4 px-5"
                >
                  <BlogCard
                    id={blog.id}
                    title={blog.title}
                    content={blog.subtitle}
                    media={blog.media[0] || null}
                    icon
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* <div className="text-center text-gray-500 my-10">
            {t("blog.noBlogs")}
          </div> */}
        {!filteredBlogs.length && !isLoading && (

          <div>
            <Image
              src={EmptyCartImg}
              alt="No image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full m-auto max-w-[350px] h-full object-contain rounded-xl border shadow-none border-none"
            />
            <p className="text-muted-foreground text-xl text-center mt-10">{t("blog.noBlogs")}</p>
          </div>
        )}

        {filteredBlogs.length > 0 && filteredBlogs.length < blogs.length && (
          <Button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            size="lg"
            className="my-10 mx-auto flex gap-2 bg-[#218A4F] text-white hover:bg-[#365343]"
          >
            <ArrowDown size={20} />
            {t("blog.loadMore")}
          </Button>
        )}
      </Container>
    </div>
  );
}
