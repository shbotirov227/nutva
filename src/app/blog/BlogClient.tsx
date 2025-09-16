"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

import BlogCard from "@/components/BlogCard";
import Container from "@/components/Container";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
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
    <div className="pt-32 pb-20">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t("common.blogs", "Yangiliklar")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("blog.subtitle", "Sog'liq va salomatlik haqida so'nggi ma'lumotlar")}
          </p>
        </div>

        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedCats={selectedCats}
          setSelectedCats={setSelectedCats}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/9] bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-xl w-28 mt-6" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: "easeOut" 
                  }}
                  className="w-full"
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

        {/* Empty State */}
        {!filteredBlogs.length && !isLoading && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-md mx-auto">
              <Image
                src={EmptyCartImg}
                alt="No results found"
                width={300}
                height={200}
                className="mx-auto mb-8 opacity-75"
              />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("blog.noBlogs", "Yangiliklar topilmadi")}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Boshqa kalit so&apos;z bilan qidiring yoki filtrlarni tozalang.
              </p>
              {(search || selectedDate || selectedCats.length > 0) && (
                <Button
                  onClick={() => {
                    setSearch("");
                    setSelectedDate(undefined);
                    setSelectedCats([]);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-xl font-semibold"
                >
                  Filtrlarni tozalash
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredBlogs.length > 0 && filteredBlogs.length < blogs.length && (
          <div className="text-center mt-16">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              size="lg"
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowDown className="w-5 h-5 mr-3" />
              {t("blog.loadMore", "Ko&apos;proq yuklash")}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
