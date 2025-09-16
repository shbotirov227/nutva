"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { GetOneBlogType } from "@/types/blogs/getOneBlog";
import BlogsComponent from "@/containers/Blogs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CalendarDays, Eye, Share2, Timer, Link as LinkIcon, Copy, Tag, Instagram, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { shareInstagramStoryWeb, shareFacebookWeb, shareTelegramWeb } from "@/lib/share";
import dynamic from "next/dynamic";
const YouTubeEmbed = dynamic(() => import("@/components/YouTubeEmbed"), { ssr: false });
import { useLang } from "@/context/LangContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/apiClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Head from "next/head"; // only for JSON-LD injection

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

type TocItem = { 
  id: string; 
  text: string; 
  level: number 
};

function formatContentToHtml(content: string): string {
  if (!content) return content;
  
  try {
    // If content already contains HTML tags, process it as HTML
    if (content.includes('<') && content.includes('>')) {
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
    
    // If content is plain text, convert line breaks to paragraphs
    const paragraphs = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `<p>${line}</p>`)
      .join('');
    
    return paragraphs;
  } catch (error) {
    console.warn("Error processing content:", error);
    return content;
  }
}

function buildTocFromHtml(html: string): TocItem[] {
  if (!html) return [];
  
  try {
    const container = document.createElement("div");
    container.innerHTML = html;
    
    const headings = Array.from(container.querySelectorAll("h1,h2,h3"));
    return headings.map((el) => ({
      id: el.id || "",
      text: el.textContent?.trim() || "",
      level: Number(el.tagName.substring(1)),
    })).filter(item => item.text && item.id);
  } catch (error) {
    console.warn("Error building TOC:", error);
    return [];
  }
}

const absMedia = (url: string): string => {
  try {
    return url?.startsWith("http") ? url : `https://www.api.nutvahealth.uz/uploads/${url}`;
  } catch {
    return "";
  }
};

// Modal component for image gallery
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
        {/* Close button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              onClick={onPrev}
              variant="ghost"
              size="sm"
              className="absolute left-4 z-10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              onClick={onNext}
              variant="ghost"
              size="sm"
              className="absolute right-4 z-10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Image */}
        <div className="relative max-h-[90vh] max-w-[90vw]">
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            priority
          />
          
          {/* Image counter */}
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

export default function BlogDetail({ blog: initialBlog, id }: { blog: GetOneBlogType; id: string }) {
  const [mounted, setMounted] = useState(false);
  const [blog, setBlog] = useState<GetOneBlogType>(initialBlog);
  const [safeHtml, setSafeHtml] = useState<string>(formatContentToHtml(initialBlog?.content || ""));
  const [toc, setToc] = useState<TocItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Image modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const { lang, isLoading } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  // Track blog view with improved error handling
  useEffect(() => {
    if (!id || typeof window === "undefined" || !blog) return;
    
    const trackView = async () => {
      const key = `viewed-blog-${id}`;
      
      // Check if already viewed in this session
      if (sessionStorage.getItem(key) === "true") return;
      
      try {
        await apiClient.postBlogView(id);
        sessionStorage.setItem(key, "true");
        
        setBlog((prev) => {
          if (!prev) return prev;
          return { 
            ...prev, 
            viewCount: (prev.viewCount || 0) + 1 
          };
        });
      } catch (error) {
        console.error("Failed to track blog view:", error);
        // Don't retry to avoid spam, just log the error
      }
    };

    trackView();
  }, [id, blog]);

  // Refetch blog data on language change with improved error handling
  useEffect(() => {
    if (!mounted || !id) return;
    
    const fetchBlogData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("API URL not configured");
          return;
        }
        
        const response = await fetch(`${apiUrl}/BlogPost/${id}?lang=${lang}`, { 
          cache: "no-store",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GetOneBlogType = await response.json();
        setBlog(data);
        setSafeHtml(formatContentToHtml(data?.content || ""));
      } catch (error) {
        console.error("Error fetching blog data:", error);
        // Keep existing data on error to avoid blank screen
      }
    };

    const currentLang = searchParams.get("lang") || "uz";
    
    if (lang !== currentLang) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("lang", lang);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
      fetchBlogData();
    } else if (initialBlog?.content) {
      setSafeHtml(formatContentToHtml(initialBlog.content));
    }
  }, [lang, isLoading, mounted, id, initialBlog?.content, router, searchParams]);

  // TOC + progress
  useEffect(() => setToc(buildTocFromHtml(safeHtml)), [safeHtml]);
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

  const pageUrl = typeof window !== "undefined" ? window.location.href : `${process.env.NEXT_PUBLIC_SITE_URL || "https://nutva.uz"}/blog/${id}?lang=${lang}`;
  
  const coverUrl = useMemo(() => {
    const first = blog?.media?.find((m) => m.mediaType === "Image" || m.mediaType === "ImageUrl");
    return first ? absMedia(first.url) : null;
  }, [blog]);
  
  // Set up gallery images
  useEffect(() => {
    if (blog?.media) {
      const imageUrls = blog.media
        .filter((m) => m.mediaType === "Image" || m.mediaType === "ImageUrl")
        .map((m) => absMedia(m.url));
      setGalleryImages(imageUrls);
    }
  }, [blog?.media]);
  
  const firstVideo = blog?.media?.find((m) => m.mediaType === "Video" || m.mediaType === "YoutubeUrl");
  const readingMin = estimateReadingTime(blog?.content || "");

  // Image modal handlers
  const openImageModal = useCallback((imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setIsModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Enhanced share functionality with error handling
  const handleNativeShare = async (): Promise<void> => {
    try {
      if (navigator.share && blog) {
        await navigator.share({ 
          title: blog.title || "Nutva Blog", 
          text: blog.metaDescription || blog.title || "", 
          url: pageUrl 
        });
      } else {
        // Fallback to copying URL if native share is not available
        await copyLink();
      }
    } catch (error) {
      console.warn("Native share failed:", error);
      // Silent fail - user might have cancelled
    }
  };

  const copyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy link:", error);
      // Fallback method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pageUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (fallbackError) {
        console.error("Fallback copy also failed:", fallbackError);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const shareTo = useCallback(
    (provider: "telegram" | "facebook" | "instagram"): void => {
      try {
        const title = blog?.title || "Nutva News";
        const url = pageUrl;
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
          default:
            console.warn("Unknown share provider:", provider);
        }
      } catch (error) {
        console.error(`Failed to share to ${provider}:`, error);
      }
    },
    [blog?.title, blog?.metaDescription, pageUrl, coverUrl]
  );

  // Early returns with proper error handling
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
        <Button onClick={() => router.push(`/${lang}/blog`)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Blogga qaytish
        </Button>
      </div>
    );
  }

  // ---------- JSON-LD (Article + optional Video + Breadcrumbs) ----------
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.metaDescription || undefined,
    datePublished: blog.createdAt || undefined,
    dateModified: blog.updatedAt || blog.createdAt || undefined,
    mainEntityOfPage: pageUrl,
    image: coverUrl ? [coverUrl] : undefined,
    author: blog.author ? { "@type": "Person", name: blog.author } : undefined,
    publisher: {
      "@type": "Organization",
      name: "Nutva",
      logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nutva.uz"}/logo.png` },
    },
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
            embedUrl: firstVideo.url.includes("embed")
              ? firstVideo.url
              : (() => {
                  try {
                    const u = new URL(firstVideo.url);
                    const id = u.hostname.includes("youtu.be")
                      ? u.pathname.slice(1)
                      : u.searchParams.get("v");
                    return id ? `https://www.youtube.com/embed/${id}` : firstVideo.url;
                  } catch {
                    return firstVideo.url;
                  }
                })(),
            uploadDate: blog.createdAt || undefined,
            thumbnailUrl: coverUrl ? [coverUrl] : undefined,
          }
      : null;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bosh sahifa", item: process.env.NEXT_PUBLIC_SITE_URL || "https://nutva.uz" },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nutva.uz"}/blog` },
      { "@type": "ListItem", position: 3, name: blog.title, item: pageUrl },
    ],
  };

  return (
    <>
      {/* Only JSON-LD here. All meta/OG/Twitter handled in generateMetadata (server). */}
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      </Head>

      {/* progress bar */}
      <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-lime-500 to-amber-400 transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-6">
        {/* Top actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={() => router.push(`/${lang}/blog`)} size="sm" variant="outline" className="gap-2 self-start">
            <ArrowLeft className="h-4 w-4" />
            {tt(t, "common.goBack", "Orqaga")}
          </Button>

          {/* Mobile: 2-col grid (Share + More) */}
          <div className="sm:hidden grid w-full grid-cols-2 gap-2">
            <Button size="sm" variant="secondary" className="gap-2" onClick={handleNativeShare}>
              <Share2 className="h-4 w-4" />
              {tt(t, "common.share", "Ulashish")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="w-full">{tt(t, "common.more", "Boshqa")}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => shareTo("telegram")}>Telegram</DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareTo("instagram")}>Instagram Stories</DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareTo("facebook")}>Facebook</DropdownMenuItem>
                <DropdownMenuItem onClick={copyLink}>
                  {copied ? (
                    <span className="inline-flex items-center gap-2"><Copy className="h-3.5 w-3.5" /> {tt(t, "common.copied", "Nusxa olindi")}</span>
                  ) : (
                    <span className="inline-flex items-center gap-2"><LinkIcon className="h-3.5 w-3.5" /> {tt(t, "common.copyLink", "Havolani nusxalash")}</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop: inline row */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => shareTo("telegram")}><Share2 className="mr-2 h-4 w-4" />Telegram</Button>
            <Button variant="outline" size="sm" onClick={() => shareTo("instagram")}><Instagram className="mr-2 h-4 w-4" />Instagram Stories</Button>
            <Button variant="outline" size="sm" onClick={() => shareTo("facebook")}>Facebook</Button>
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? <><Copy className="mr-2 h-4 w-4" /> {tt(t,"common.copied","Nusxa olindi")}</> : <><LinkIcon className="mr-2 h-4 w-4" /> {tt(t,"common.copyLink","Havolani nusxalash")}</>}
            </Button>
          </div>
        </div>

        {/* Hero */}
        <div className={clsx("relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-50 to-white", "shadow-[0_10px_40px_rgba(16,185,129,0.15)]")}>
          {coverUrl && (
            <div 
              className="relative aspect-[16/9] md:aspect-[16/8] w-full cursor-pointer group"
              onClick={() => openImageModal(0)}
            >
              <Image 
                src={coverUrl} 
                alt={blog.title} 
                fill 
                priority 
                className="object-cover transition-transform group-hover:scale-[1.02]" 
                sizes="100vw" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </div>
          )}

          <div className={clsx("p-5 sm:p-8 lg:p-10", coverUrl ? "lg:-mt-24 relative z-10" : "")}>
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

                <h1 className="mt-2 text-balance text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  {blog.title}
                </h1>

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
                {/* gallery */}
                {blog?.media?.length > 1 && (
                  <div className={clsx("mb-6 grid gap-4", blog.media.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
                    {blog.media.slice(1).map((m, idx) => {
                      const src = absMedia(m.url);
                      const isImage = m.mediaType === "Image" || m.mediaType === "ImageUrl";
                      const galleryIndex = blog.media
                        .filter((media) => media.mediaType === "Image" || media.mediaType === "ImageUrl")
                        .findIndex((media) => media === m);

                      if (m.mediaType === "YoutubeUrl") {
                        return (
                          <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <YouTubeEmbed link={src} className="absolute inset-0 h-full w-full" />
                          </div>
                        );
                      }
                      
                      if (m.mediaType === "Video") {
                        return (
                          <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <video 
                              controls 
                              className="h-full w-full object-cover" 
                              preload="metadata"
                              poster={coverUrl || undefined}
                            >
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
                  {/* content */}
                  <article
                    ref={contentRef}
                    className={clsx(
                      "prose prose-neutral prose-lg max-w-none leading-relaxed",
                      // Headings
                      "[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-12 [&>h1]:mb-6 [&>h1]:scroll-mt-24",
                      "[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:scroll-mt-24 [&>h2]:text-emerald-700",
                      "[&>h3]:text-xl [&>h3]:font-medium [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:scroll-mt-24 [&>h3]:text-emerald-600",
                      // Paragraphs
                      "[&>p]:mb-6 [&>p]:text-gray-700 [&>p]:leading-7",
                      // Lists
                      "[&>ul]:mb-6 [&>ol]:mb-6 [&>li]:mb-2",
                      // Images
                      "[&>p>img]:rounded-xl [&>p>img]:border [&>p>img]:shadow-sm [&>p>img]:my-6",
                      "prose-img:rounded-xl prose-img:border prose-img:shadow-sm prose-img:my-6",
                      // Links
                      "prose-a:text-emerald-600 prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:underline hover:prose-a:text-emerald-700",
                      // Quotes
                      "prose-blockquote:border-l-4 prose-blockquote:border-emerald-200 prose-blockquote:bg-emerald-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg",
                      // Code
                      "prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono",
                      "prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4"
                    )}
                    dangerouslySetInnerHTML={{ __html: safeHtml || "" }}
                  />

                  {/* sticky TOC + CTA */}
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
                                <li key={item.id} className={clsx(
                                  "transition-all",
                                  item.level >= 3 ? "pl-4 border-l-2 border-gray-200" : ""
                                )}>
                                  <a 
                                    href={`#${item.id}`} 
                                    className="block line-clamp-2 text-gray-600 hover:text-emerald-600 transition-colors py-1 hover:pl-2"
                                  >
                                    <span className="text-emerald-500 font-mono text-xs mr-2">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
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
                        <p className="mt-1 text-sm text-muted-foreground">
                          {tt(t, "blogSidebar.subtitle", "Blog mavzusiga mos biologik faol qo‘shimchalarni ko‘ring.")}
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                          <Button size="sm" className="w-full" onClick={() => router.push(`/${lang}/product`)}> 
                            {tt(t, "blogSidebar.viewProducts", "Mahsulotlarni ko‘rish")}
                          </Button>
                          <Button size="sm" variant="outline" className="w-full" onClick={() => router.push(`/${lang}/contact`)}>
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

        {/* related */}
        <div className="my-10">
          <Separator />
        </div>
        <section aria-label="More from Nutva">
          <BlogsComponent />
        </section>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        images={galleryImages}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
}
