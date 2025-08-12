import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import Container from "@/components/Container";
import type { GetOneBlogType } from "@/types/blogs/getOneBlog";
import BlogDetail from "./BlogDetail";
import RedirectIfNoLang from "@/components/RedirectIfNoLang";

// Support async params in newer Next
type MaybePromise<T> = T | Promise<T>;
type Props = {
  params: MaybePromise<{ id: string }>;
  searchParams: MaybePromise<{ lang?: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nutva.uz";
const ABS = (path: string) => new URL(path, SITE_URL).toString();

function absoluteMediaUrl(url: string) {
  return url.startsWith("http")
    ? url
    : `https://www.api.nutvahealth.uz/uploads/${url}`;
}

function ytIdFromUrl(u: string): string | null {
  try {
    const url = new URL(u);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") || url.pathname.split("/").pop() || null;
    }
  } catch {}
  return null;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const { lang = "uz" } = await searchParams;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${id}?lang=${lang}`, {
      cache: "no-store",
      // headers: { 'accept-language': lang } // optional
    });

    if (!res.ok) {
      return {
        title: "Blog Post",
        description: "Post not found",
        robots: { index: false, follow: false },
      };
    }

    const post: GetOneBlogType = await res.json();

    // IMAGES
    const imageUrls =
      post.media
        ?.filter((m) => m.mediaType === "Image" || m.mediaType === "ImageUrl")
        .map((m) => absoluteMediaUrl(m.url)) ?? [];

    const ogImages = (imageUrls.length ? imageUrls : [ABS("/og-default.jpg")]).map((url) => ({
      url,
      alt: post.title,
    }));

    // VIDEO (native or YouTube)
    const vid = post.media?.find((m) => m.mediaType === "Video" || m.mediaType === "YoutubeUrl");
    const videos: { url: string; type: string }[] | undefined =
      vid?.mediaType === "Video"
        ? [
            {
              url: absoluteMediaUrl(vid.url),
              type: "video/mp4",
            },
          ]
        : vid?.mediaType === "YoutubeUrl"
        ? (() => {
            const idYt = ytIdFromUrl(vid.url);
            if (!idYt) return undefined;
            const embed = `https://www.youtube.com/embed/${idYt}`;
            return [{ url: embed, type: "text/html" }];
          })()
        : undefined;

    // Canonical + alternates (hreflang)
    const pagePath = `/blog/${id}`;
    const canonical = `${ABS(pagePath)}?lang=${lang}`;
    const alternatesLanguages: Record<string, string> = {
      uz: `${ABS(pagePath)}?lang=uz`,
      ru: `${ABS(pagePath)}?lang=ru`,
      en: `${ABS(pagePath)}?lang=en`,
    };

    const plainText = (post.content ? post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "");
    const description = post.metaDescription || plainText.slice(0, 160);

    // Twitter: use player when we have a video, else large image
  const twitterCard: "summary" | "summary_large_image" | "app" | "player" = videos?.length ? "player" : "summary_large_image";

    return {
      metadataBase: new URL(SITE_URL),
      title: post.metaTitle || post.title,
      description,
      applicationName: "Nutva",
      referrer: "origin-when-cross-origin",
      category: "Health",
      authors: post.author ? [{ name: post.author }] : undefined,
      creator: post.author || "Nutva",
      keywords: (post.metaKeywords || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),

      alternates: {
        canonical,
        languages: alternatesLanguages,
      },

      // Robots
      robots: {
        index: true,
        follow: true,
        googleBot: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },

      // Open Graph
      openGraph: {
        type: "article",
        siteName: "Nutva",
        locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ",
        url: canonical,
        title: post.metaTitle || post.title,
        description,
        images: ogImages,
        videos,
        authors: post.author ? [post.author] : undefined,
        tags: (post.metaKeywords || "")
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      },

      // Twitter (works for Telegram too because it falls back to OG)
      twitter: {
        card: twitterCard,
        title: post.metaTitle || post.title,
        description,
        images: ogImages.map((i) => i.url),
        site: "@nutva", // if you have it, set
        creator: post.author ? `@${post.author.replace(/\s+/g, "").toLowerCase()}` : undefined,
      },

      // Extra tags unsupported by the strongly-typed fields
      other: {
        "og:site_name": "Nutva",
        ...(videos?.length
          ? {
              // Twitter player card extras (esp. for YouTube)
              "twitter:player": videos[0].url,
              "twitter:player:width": "1280",
              "twitter:player:height": "720",
            }
          : {}),
      },

      icons: {
        icon: [{ url: "/favicon.ico" }],
      },
    };
  } catch (e) {
    console.error("generateMetadata error:", e);
    return {
      title: "Blog Post",
      description: "Error loading post",
      robots: { index: false, follow: false },
    };
  }
}

// Move themeColor to viewport export per Next.js guidance (avoids warning)
export const viewport: Viewport = {
  themeColor: "#10b981",
};

export default async function BlogPostPage({ params, searchParams }: Props) {
  try {
    const { id } = await params;
    const { lang = "uz" } = await searchParams;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${id}?lang=${lang}`, {
      cache: "no-store",
    });
    if (!res.ok) return notFound();

    const blog: GetOneBlogType = await res.json();

    return (
      <Container className="pt-28 pb-24 max-w-6xl">
        <RedirectIfNoLang langFromUrl={lang} id={id} />
        <BlogDetail blog={blog} id={id} />
      </Container>
    );
  } catch (e) {
    console.error("BlogPostPage error:", e);
    return notFound();
  }
}
