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

export default function BlogPage() {
  const { data: blogs = [] as GetAllBlogsType, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => apiClient.getAllBlogs("uz"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="pt-32">
      <Container>
        <h1 className="text-3xl font-bold mb-10">Blog Page</h1>
        <FilterBar />
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
                {blogs.map((blog: GetOneBlogType) => (
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
                      content={blog.content}
                      media={blog.media[0] || null}
                      icon
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
        </div>

        <Button
          size="lg"
          color="green"
          variant="outline"
          className="flex items-center justify-between my-10 cursor-pointer mx-auto bg-[#218A4F] text-white hover:bg-[#365343] hover:text-white transition-all"
        >
          <ArrowDown size={20} />
          Load more
        </Button>
      </Container>
    </div>
  );
}
