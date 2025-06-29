import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import BlogDetail from "./BlogDetail";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${params.slug}`);

  if (!res.ok) {
    return {
      title: "Blog Post",
      description: "Post not found",
    };
  }

  const post: GetOneBlogType = await res.json();
  const localized = post["uz"]; // Fallback uchun. SEO static qismda tilni aniq bilolmaymiz

  return {
    title: localized.metaTitle || localized.title,
    description: localized.metaDescription || localized.content?.slice(0, 150),
    keywords: localized.metaKeywords?.split(",") || [],
    openGraph: {
      title: localized.metaTitle || localized.title,
      description: localized.metaDescription || localized.content?.slice(0, 150),
      images: post?.media?.length ? [post?.media[0]] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/BlogPost/${params.slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return notFound();
  }

  const blog: GetOneBlogType = await res.json();

  return (
    <Container className="pt-32 pb-25">
      <BlogDetail blog={blog} />
    </Container>
  );
}
