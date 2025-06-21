
import BlogClient from "./BlogClient";
import { GetAllBlogsType } from "@/types/blogs/getAllBlogs";

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/BlogPost?lang=uz`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const blogs: GetAllBlogsType = await res.json();
  const first = blogs[0];

  return {
    title: first?.metaTitle || "Blog",
    description: first?.metaDescription || "Blog description",
    keywords: first?.metaKeywords || "nutva, blog, maqola",
  };
}

export default function BlogPage() {
  return <BlogClient />;
}
