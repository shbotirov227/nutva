"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { GetOneBlogType } from "@/types/blogs/getOneBlog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Share2,
  Timer,
  Link as LinkIcon,
  Copy,
  Tag,
  Instagram,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { shareInstagramStoryWeb, shareFacebookWeb, shareTelegramWeb } from "@/lib/share";
import dynamic from "next/dynamic";
const YouTubeEmbed = dynamic(() => import("@/components/YouTubeEmbed"), { ssr: false });
const BlogsComponent = dynamic(() => import("@/containers/Blogs"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
});
import { useLang } from "@/context/LangContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/apiClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Head from "next/head"; // JSON-LD injection only

type Lang = "uz" | "ru" | "en";

const tt = (t: (k: string) => string, key: string, fallback: string): string => {
  try {
    const value = t(key);
    return value === key ? fallback : value;
  } catch {
    return fallback;
  }
};

const stripHtml = (html: string): string => {
  try {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
};

const estimateReadingTime = (html: string, wpm = 220): number => {
  try {
    const text = stripHtml(html);
    const wordCount = text.split(" ").filter(Boolean).length;
    return Math.max(1, Math.round(wordCount / wpm));
  } catch {
    return 1;
  }
};

type TocItem = { id: string; text: string; level: number };

function formatContentToHtml(content: string): string {
  if (!content) return content;
  try {
    // If it looks like HTML, add ids for headings
    if (content.includes("<") && content.includes(">")) {
      const container = document.createElement("div");
      container.innerHTML = content;

      const headings = container.querySelectorAll("h1,h2,h3");
      headings.forEach((el) => {
        if (!el.id && el.textContent) {
          const id = el.textContent
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/(^-|-$)+/g, "");
          if (id) el.id = id;
        }
      });

      return container.innerHTML;
    }

    // plain text -> paragraphs
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");
  } catch {
    return content;
  }
}

function buildTocFromHtml(html: string): TocItem[] {
  if (!html) return [];
  try {
    const container = document.createElement("div");
    container.innerHTML = html;

    const headings = Array.from(container.querySelectorAll("h1,h2,h3"));
    return headings
      .map((el) => ({
        id: el.id || "",
        text: el.textContent?.trim() || "",
        level: Number(el.tagName.substring(1)),
      }))
      .filter((item) => item.text && item.id);
  } catch {
    return [];
  }
}

const UPLOADS_BASE ="https://nutva.uz";

const absMedia = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  const base = UPLOADS_BASE.replace(/\/$/, "");
  return `${base}/uploads/${url.replace(/^\/+/, "")}`;
};



interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, images, currentIndex, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    if (isOpen) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center p-4">
        <Button onClick={onClose} variant="ghost" size="sm" className="absolute top-4 right-4 z-10 text-white hover:bg-white/20">
          <X className="h-6 w-6" />
        </Button>

        {images.length > 1 && (
          <>
            <Button onClick={onPrev} variant="ghost" size="sm" className="absolute left-4 z-10 text-white hover:bg-white/20">
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button onClick={onNext} variant="ghost" size="sm" className="absolute right-4 z-10 text-white hover:bg-white/20">
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        <div className="relative max-h-[90vh] max-w-[90vw]">
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            priority
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function BlogDetail({
  blog: initialBlog,
  id,
  routeLang,
}: {
  blog: GetOneBlogType;
  id: string;
  routeLang: Lang;
}) {
  const [mounted, setMounted] = useState(false);
  const [blog, setBlog] = useState<GetOneBlogType>(initialBlog);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const { lang, isLoading } = useLang(); // UI language toggle
  const router = useRouter();
  const { t } = useTranslation();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nutva.uz";
  

  // Canonical URL MUST be path-based (no ?lang=)
  const canonicalUrl = useMemo(() => `${SITE_URL}/${routeLang}/blog/${id}`, [SITE_URL, routeLang, id]);

  useEffect(() => setMounted(true), []);

  // If user switches language, move to localized path and let the server fetch correct content/metadata
  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!lang || (lang !== "uz" && lang !== "ru" && lang !== "en")) return;

    if (lang !== routeLang) {
      router.replace(`/${lang}/blog/${id}`, { scroll: false });
    }
  }, [lang, routeLang, id, mounted, isLoading, router]);

  // Track view once per session
  useEffect(() => {
    if (!id || typeof window === "undefined" || !blog) return;

    const trackView = async () => {
      const key = `viewed-blog-${id}`;
      if (sessionStorage.getItem(key) === "true") return;

      try {
        await apiClient.postBlogView(id);
        sessionStorage.setItem(key, "true");
        setBlog((prev) => ({ ...prev, viewCount: (prev.viewCount || 0) + 1 }));
      } catch (error) {
        console.error("Failed to track blog view:", error);
      }
    };

    trackView();
  }, [id, blog]);

  // HTML formatting + TOC
  const safeHtml = useMemo(() => formatContentToHtml(blog?.content || ""), [blog?.content]);
  const toc = useMemo(() => buildTocFromHtml(safeHtml), [safeHtml]);

  const galleryImages = useMemo(() => {
    if (!blog?.media) return [];
    return blog.media
      .filter((m) => m.mediaType === "Image" || m.mediaType === "ImageUrl")
      .map((m) => absMedia(m.url));
  }, [blog?.media]);

  // Progress
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const total = el.scrollHeight - window.innerHeight * 0.6;
      const scrolled = Math.min(total, Math.max(0, window.scrollY + window.innerHeight - el.offsetTop));
      setProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const firstMedia = useMemo(() => blog?.media?.[0] || null, [blog?.media]);

  const isFirstMediaYouTube = useMemo(() => {
    if (!firstMedia?.url) return false;
    const url = absMedia(firstMedia.url);
    return firstMedia.mediaType === "YoutubeUrl" || url.includes("youtube.com") || url.includes("youtu.be");
  }, [firstMedia]);

  const coverUrl = useMemo(() => {
    const first = blog?.media?.find((m) => m.mediaType === "Image" || m.mediaType === "ImageUrl");
    return first ? absMedia(first.url) : null;
  }, [blog?.media]);

  const firstVideo = useMemo(() => blog?.media?.find((m) => m.mediaType === "Video" || m.mediaType === "YoutubeUrl"), [blog?.media]);

  const readingMin = useMemo(() => estimateReadingTime(blog?.content || ""), [blog?.content]);

  const openImageModal = useCallback((imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setIsModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => setIsModalOpen(false), []);
  const nextImage = useCallback(() => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length), [galleryImages.length]);
  const prevImage = useCallback(() => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length), [galleryImages.length]);

  const copyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleNativeShare = async (): Promise<void> => {
    try {
      if (navigator.share && blog) {
        await navigator.share({
          title: blog.title || "Nutva Blog",
          text: blog.metaDescription || blog.title || "",
          url: canonicalUrl,
        });
      } else {
        await copyLink();
      }
    } catch {
      // user cancels -> ignore
    }
  };

  const shareTo = useCallback(
    (provider: "telegram" | "facebook" | "instagram"): void => {
      try {
        const title = blog?.title || "Nutva News";
        const url = canonicalUrl;
        const fbAppId = process.env.NEXT_PUBLIC_FB_APP_ID;

        switch (provider) {
          case "telegram":
            shareTelegramWeb(url, title);
            break;
          case "facebook":
            shareFacebookWeb({
              pageUrl: url,
              quote: blog?.metaDescription || title,
              hashtag: "Nutva",
              appId: fbAppId,
            });
            break;
          case "instagram":
            shareInstagramStoryWeb({
              title,
              coverUrl: coverUrl || "",
              pageUrl: url,
              brand: "nutva.uz",
            });
            break;
        }
      } catch (error) {
        console.error(`Failed to share to ${provider}:`, error);
      }
    },
    [blog?.title, blog?.metaDescription, canonicalUrl, coverUrl]
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="text-gray-500 text-lg">Blog post topilmadi</div>
        <Button onClick={() => router.push(`/${routeLang}/blog`)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Blogga qaytish
        </Button>
      </div>
    );
  }

  // ---------- JSON-LD ----------
  const plainTextContent = stripHtml(blog?.content || "");
  const wordCount = plainTextContent.split(/\s+/).filter(Boolean).length;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.metaDescription || undefined,
    articleBody: plainTextContent.slice(0, 1000),
    wordCount,
    datePublished: blog.createdAt || undefined,
    dateModified: blog.updatedAt || blog.createdAt || undefined,
    mainEntityOfPage: canonicalUrl,
    image: coverUrl ? [coverUrl] : undefined,
    author: blog.author ? { "@type": "Person", name: blog.author } : undefined,
    publisher: {
      "@type": "Organization",
      name: "Nutva",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    inLanguage: routeLang === "uz" ? "uz-UZ" : routeLang === "ru" ? "ru-RU" : "en-US",
  };

  const videoLd =
    firstVideo
      ? firstVideo.mediaType === "Video"
        ? {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: blog.title,
            description: blog.metaDescription || undefined,
            contentUrl: absMedia(firstVideo.url),
            uploadDate: blog.createdAt || undefined,
            thumbnailUrl: coverUrl ? [coverUrl] : undefined,
          }
        : {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: blog.title,
            description: blog.metaDescription || undefined,
            embedUrl: firstVideo.url,
            uploadDate: blog.createdAt || undefined,
            thumbnailUrl: coverUrl ? [coverUrl] : undefined,
          }
      : null;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nutva", item: `${SITE_URL}/${routeLang}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/${routeLang}/blog` },
      { "@type": "ListItem", position: 3, name: blog.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      </Head>

      <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-lime-500 to-amber-400 transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={() => router.push(`/${routeLang}/blog`)} size="sm" variant="outline" className="gap-2 self-start">
            <ArrowLeft className="h-4 w-4" />
            {tt(t, "common.goBack", "Orqaga")}
          </Button>

          <div className="sm:hidden grid w-full grid-cols-2 gap-2">
            <Button size="sm" variant="secondary" className="gap-2" onClick={handleNativeShare}>
              <Share2 className="h-4 w-4" />
              {tt(t, "common.share", "Ulashish")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="w-full">
                  {tt(t, "common.more", "Boshqa")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => shareTo("telegram")}>Telegram</DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareTo("instagram")}>Instagram Stories</DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareTo("facebook")}>Facebook</DropdownMenuItem>
                <DropdownMenuItem onClick={copyLink}>
                  {copied ? (
                    <span className="inline-flex items-center gap-2">
                      <Copy className="h-3.5 w-3.5" /> {tt(t, "common.copied", "Nusxa olindi")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <LinkIcon className="h-3.5 w-3.5" /> {tt(t, "common.copyLink", "Havolani nusxalash")}
                    </span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => shareTo("telegram")}>
              <Share2 className="mr-2 h-4 w-4" />
              Telegram
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareTo("instagram")}>
              <Instagram className="mr-2 h-4 w-4" />
              Instagram Stories
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareTo("facebook")}>
              Facebook
            </Button>
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? (
                <>
                  <Copy className="mr-2 h-4 w-4" /> {tt(t, "common.copied", "Nusxa olindi")}
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" /> {tt(t, "common.copyLink", "Havolani nusxalash")}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={clsx("relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-50 to-white", "shadow-[0_10px_40px_rgba(16,185,129,0.15)]")}>
          {isFirstMediaYouTube && firstMedia?.url ? (
            <div className="relative aspect-[16/9] md:aspect-[16/8] w-full">
              <YouTubeEmbed link={absMedia(firstMedia.url)} className="absolute inset-0 h-full w-full" />
            </div>
          ) : coverUrl ? (
            <div className="relative aspect-[16/9] md:aspect-[16/8] w-full cursor-pointer group" onClick={() => openImageModal(0)}>
              <Image src={coverUrl} alt={blog.title} fill priority className="object-cover transition-transform group-hover:scale-[1.02]" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </div>
          ) : null}

          <div className={clsx("p-5 sm:p-8 lg:p-10", (coverUrl || isFirstMediaYouTube) ? "lg:-mt-24 relative z-10" : "")}>
            <Card className="mx-auto w-full max-w-5xl rounded-2xl border-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {blog?.createdAt && (
                    <div className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(blog.createdAt).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </div>
                  )}
                  {typeof blog?.viewCount === "number" && (
                    <>
                      <span className="opacity-40">•</span>
                      <div className="inline-flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {blog.viewCount} {tt(t, "common.views", "ko‘rish")}
                      </div>
                    </>
                  )}
                  {blog?.content && (
                    <>
                      <span className="opacity-40">•</span>
                      <div className="inline-flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        ~{readingMin} {tt(t, "common.minRead", "daq. o‘qish")}
                      </div>
                    </>
                  )}
                </div>

                <h1 className="mt-2 text-balance text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">{blog.title}</h1>

                {blog?.metaKeywords && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {blog.metaKeywords
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean)
                      .slice(0, 6)
                      .map((kw, i) => (
                        <Badge key={i} variant="secondary" className="inline-flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {kw}
                        </Badge>
                      ))}
                  </div>
                )}
              </CardHeader>

              <CardContent className="pb-6">
                {blog?.media?.length > 1 && (
                  <div className={clsx("mb-6 grid gap-4", blog.media.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
                    {blog.media.slice(1).map((m, idx) => {
                      const src = absMedia(m.url);
                      const isYouTubeUrl = m.mediaType === "YoutubeUrl" || src.includes("youtube.com") || src.includes("youtu.be");
                      const isImage = m.mediaType === "Image" || m.mediaType === "ImageUrl";
                      const isVideo = m.mediaType === "Video" && !isYouTubeUrl;

                      const galleryIndex = blog.media
                        .filter((media) => media.mediaType === "Image" || media.mediaType === "ImageUrl")
                        .findIndex((media) => media === m);

                      if (isYouTubeUrl) {
                        return (
                          <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <YouTubeEmbed link={src} className="absolute inset-0 h-full w-full" />
                          </div>
                        );
                      }

                      if (isVideo) {
                        return (
                          <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <video controls className="h-full w-full object-cover" preload="metadata" poster={coverUrl || undefined}>
                              <source src={src} type="video/mp4" />
                            </video>
                          </div>
                        );
                      }

                      if (isImage) {
                        return (
                          <div
                            key={idx}
                            className="group relative aspect-video overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => openImageModal(galleryIndex)}
                          >
                            <Image
                              src={src}
                              alt={m.altText || `Gallery image ${idx + 1}`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
                  <article
                    ref={contentRef}
                    className={clsx(
                      "prose prose-neutral prose-lg max-w-none leading-relaxed",
                      "[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-12 [&>h1]:mb-6 [&>h1]:scroll-mt-24",
                      "[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:scroll-mt-24 [&>h2]:text-emerald-700",
                      "[&>h3]:text-xl [&>h3]:font-medium [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:scroll-mt-24 [&>h3]:text-emerald-600",
                      "[&>p]:mb-6 [&>p]:text-gray-700 [&>p]:leading-7",
                      "[&>ul]:mb-6 [&>ol]:mb-6 [&>li]:mb-2",
                      "prose-a:text-emerald-600 prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:underline hover:prose-a:text-emerald-700",
                      "prose-blockquote:border-l-4 prose-blockquote:border-emerald-200 prose-blockquote:bg-emerald-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg",
                      "prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono",
                      "prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4"
                    )}
                    dangerouslySetInnerHTML={{ __html: safeHtml || "" }}
                  />

                  <aside className="order-first lg:order-none">
                    <div className="lg:sticky lg:top-24 lg:max-h-[70vh] lg:overflow-auto">
                      {toc.length > 0 && (
                        <div className="mb-6 rounded-xl border bg-card/50 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-shadow">
                          <p className="mb-4 text-base font-semibold tracking-wide text-gray-900 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-emerald-600" />
                            {tt(t, "common.tableOfContents", "Mundarija")}
                          </p>
                          <nav>
                            <ul className="space-y-3 text-sm">
                              {toc.map((item, index) => (
                                <li key={item.id} className={clsx("transition-all", item.level >= 3 ? "pl-4 border-l-2 border-gray-200" : "")}>
                                  <a href={`#${item.id}`} className="block line-clamp-2 text-gray-600 hover:text-emerald-600 transition-colors py-1 hover:pl-2">
                                    <span className="text-emerald-500 font-mono text-xs mr-2">{String(index + 1).padStart(2, "0")}</span>
                                    {item.text}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </nav>
                        </div>
                      )}

                      <div className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
                        <h3 className="text-lg font-semibold">{tt(t, "blogSidebar.title", "Sizga mos mahsulotni tanlang")}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{tt(t, "blogSidebar.subtitle", "Blog mavzusiga mos biologik faol qo‘shimchalarni ko‘ring.")}</p>
                        <div className="mt-4 flex flex-col gap-2">
                          <Button size="sm" className="w-full" onClick={() => router.push(`/${routeLang}/product`)}>
                            {tt(t, "blogSidebar.viewProducts", "Mahsulotlarni ko‘rish")}
                          </Button>
                          <Button size="sm" variant="outline" className="w-full" onClick={() => router.push(`/${routeLang}/contact`)}>
                            {tt(t, "blogSidebar.getConsultation", "Maslahat olish")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="my-10">
          <Separator />
        </div>

        <section aria-label="More from Nutva">
          <BlogsComponent />
        </section>
      </div>

      <ImageModal isOpen={isModalOpen} onClose={closeImageModal} images={galleryImages} currentIndex={currentImageIndex} onNext={nextImage} onPrev={prevImage} />
    </>
  );
}
