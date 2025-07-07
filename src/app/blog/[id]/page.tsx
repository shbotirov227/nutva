import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import BlogDetail from "./BlogDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const lang = resolvedSearchParams.lang || "uz";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${resolvedParams.id}?lang=${lang}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        title: "Blog Post",
        description: "Post not found",
      };
    }

    const post: GetOneBlogType = await res.json();

    const imageUrls =
      post.media
        ?.filter((m) => m.mediaType === "Image" || m.mediaType === "ImageUrl")
        .map((m) =>
          m.url.startsWith("http")
            ? m.url
            : `https://www.api.nutvahealth.uz/uploads/${m.url}`
        ) || [];

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.content?.slice(0, 150),
      keywords: post.metaKeywords?.split(",") || [],
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.content?.slice(0, 150),
        images: imageUrls,
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "Blog Post",
      description: "Error loading post",
    };
  }
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const lang = resolvedSearchParams.lang || "uz";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${resolvedParams.id}?lang=${lang}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("API Error:", res.status, res.statusText);
      return notFound();
    }

    const blog: GetOneBlogType = await res.json();

    return (
      <Container className="pt-32 pb-25">
        <BlogDetail blog={blog} id={resolvedParams.id} />
      </Container>
    );
  } catch (error) {
    console.error("Error in BlogPostPage:", error);
    return notFound();
  }
}