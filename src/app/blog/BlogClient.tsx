"use client";

import BlogCard from "@/components/BlogCard";
import Container from "@/components/Container";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/apiClient";
import { GetAllBlogsType } from "@/types/blogs/getAllBlogs";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BlogPage() {

  const [, setVisibleCount] = useState(6);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const { t, i18n } = useTranslation();

  const lang = i18n.language || "uz";

  const { data: blogs = [] as GetAllBlogsType, isLoading } = useQuery({
    queryKey: ["blogs", lang],
    queryFn: () => apiClient.getAllBlogs(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  const filteredBlogs = blogs.filter((blog: GetOneBlogType) => {
    const matchSearch = blog.title.toLowerCase().includes(search.toLowerCase())
      || blog.content.toLowerCase().includes(search.toLowerCase())
      || blog.subtitle.toLowerCase().includes(search.toLowerCase())
    const matchDate = selectedDate
      ? new Date(blog.createdAt!).toDateString() === selectedDate.toDateString()
      : true;
    const matchCategory = selectedCats.length
      ? selectedCats.every(cat => blog.metaKeywords.toLowerCase().includes(cat))
      : true;
    return matchSearch && matchDate && matchCategory;
  });

  return (
    <div className="pt-32">
      <Container>
        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedCats={selectedCats}
          setSelectedCats={setSelectedCats}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
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
            : (
              <AnimatePresence mode="popLayout">
                {filteredBlogs?.map((blog: GetOneBlogType) => (
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

        {filteredBlogs.length ? (
          <Button
            onClick={handleLoadMore}
            size="lg"
            color="green"
            variant="outline"
            className="flex items-center justify-between my-10 cursor-pointer mx-auto bg-[#218A4F] text-white hover:bg-[#365343] hover:text-white transition-all"
          >
            <ArrowDown size={20} />
            {t("blog.loadMore")}

          </Button>
        ) : (
          <div className="text-center text-gray-500 my-10">
            {t("blog.noBlogs")}
          </div>
        )}
      </Container>
    </div>
  );
}
