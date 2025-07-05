import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import BlogDetail from "./BlogDetail";
import { headers } from "next/headers";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const lang = headers().get("accept-language")?.split(",")[0].split("-")[0] || "uz";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${params.slug}`, {
    cache: "no-store",
    headers: {
      "Accept-Language": lang,
    },
  });

  if (!res.ok) {
    return {
      title: "Blog Post",
      description: "Post not found",
    };
  }

  const post: GetOneBlogType = await res.json();

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.content?.slice(0, 150),
    keywords: post.metaKeywords?.split(",") || [],
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.content?.slice(0, 150),
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
