"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { GetOneBlogType } from "@/types/blogs/getOneBlog";
import BlogsComponent from "@/containers/Blogs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CalendarDays, Eye, Share2, Timer, Link as LinkIcon, Copy, Tag, Instagram } from "lucide-react";
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

const tt = (t: (k: string) => string, key: string, fallback: string) => {
  const v = t(key);
  return v === key ? fallback : v;
};
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const estimateReadingTime = (html: string, wpm = 220) => Math.max(1, Math.round(stripHtml(html).split(" ").filter(Boolean).length / wpm));
type TocItem = { id: string; text: string; level: number };

function ensureIdsOnHeadings(html: string): string {
  if (!html) return html;
  const c = document.createElement("div");
  c.innerHTML = html;
  c.querySelectorAll("h1,h2,h3").forEach((el) => {
    if (!el.id) {
      const id = (el.textContent || "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/(^-|-$)+/g, "");
      if (id) el.id = id;
    }
  });
  return c.innerHTML;
}
function buildTocFromHtml(html: string): TocItem[] {
  if (!html) return [];
  const c = document.createElement("div");
  c.innerHTML = html;
  return Array.from(c.querySelectorAll("h1,h2,h3")).map((el) => ({
    id: el.id,
    text: el.textContent || "",
    level: Number(el.tagName.substring(1)),
  }));
}
const absMedia = (url: string) => (url?.startsWith("http") ? url : `https://www.api.nutvahealth.uz/uploads/${url}`);

export default function BlogDetail({ blog: initialBlog, id }: { blog: GetOneBlogType; id: string }) {
  const [mounted, setMounted] = useState(false);
  const [blog, setBlog] = useState<GetOneBlogType>(initialBlog);
  const [safeHtml, setSafeHtml] = useState<string>(initialBlog?.content || "");
  const [toc, setToc] = useState<TocItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const { lang, isLoading } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  // one view per session
  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    const key = `viewed-blog-${id}`;
    if (sessionStorage.getItem(key) === "true") return;
    (async () => {
      try {
        await apiClient.postBlogView(id);
        sessionStorage.setItem(key, "true");
        setBlog((prev) => (prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : prev));
      } catch (err) {
        console.error("Failed to track view:", err);
      }
    })();
  }, [id]);

  // refetch on lang change + ensure IDs
  useEffect(() => {
    if (!mounted) return;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${id}?lang=${lang}`, { cache: "no-store" });
        if (res.ok) {
          const data: GetOneBlogType = await res.json();
          setBlog(data);
          setSafeHtml(ensureIdsOnHeadings(data?.content || ""));
        }
      } catch (e) {
        console.error("Error fetching blog:", e);
      }
    };
    const currentLang = searchParams.get("lang") || "uz";
    if (lang !== currentLang) {
      const next = new URLSearchParams(searchParams);
      next.set("lang", lang);
      router.push(`?${next.toString()}`, { scroll: false });
      fetchBlog();
    } else if (initialBlog?.content) {
      setSafeHtml(ensureIdsOnHeadings(initialBlog.content));
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
  const firstVideo = blog?.media?.find((m) => m.mediaType === "Video" || m.mediaType === "YoutubeUrl");
  const readingMin = estimateReadingTime(blog?.content || "");

  // share
  const handleNativeShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: blog?.title || "Nutva", text: blog?.metaDescription || "", url: pageUrl });
    } catch {}
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const shareTo = useCallback(
    (provider: "telegram" | "facebook" | "instagram") => {
      const fbAppId = process.env.NEXT_PUBLIC_FB_APP_ID;
  const title = blog?.title || "Nutva News";
      const url = pageUrl;

      if (provider === "telegram") {
        shareTelegramWeb(url, title);
        return;
      }
      if (provider === "facebook") {
        shareFacebookWeb({
          pageUrl: url,
          quote: blog?.metaDescription || title,
          hashtag: "Nutva",
          appId: fbAppId,
        });
        return;
      }
      if (provider === "instagram") {
        shareInstagramStoryWeb({
          title,
            coverUrl: coverUrl,
          pageUrl: url,
          brand: "nutva.uz",
        });
        return;
      }
    },
    [blog?.title, blog?.metaDescription, pageUrl, coverUrl]
  );

  if (!mounted || !blog) return null;

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
            <div className="relative aspect-[16/8] w-full">
              <Image src={coverUrl} alt={blog.title} fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
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
                  <div className={clsx("mb-6 grid gap-3", blog.media.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3")}>
                    {blog.media.slice(1).map((m, idx) => {
                      const src = absMedia(m.url);
                      if (m.mediaType === "YoutubeUrl") {
                        return (
                          <div key={idx} className="relative aspect-video overflow-hidden rounded-xl border">
                            <YouTubeEmbed link={src} className="absolute inset-0 h-full w-full" />
                          </div>
                        );
                      }
                      if (m.mediaType === "Video") {
                        return (
                          <div key={idx} className="relative aspect-video overflow-hidden rounded-xl border">
                            <video controls className="h-full w-full object-cover" preload="metadata">
                              <source src={src} type="video/mp4" />
                            </video>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="relative aspect-video overflow-hidden rounded-xl border">
                          <Image src={src} alt={m.altText || `image-${idx + 1}`} fill className="object-cover" loading="lazy" decoding="async" />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
                  {/* content */}
                  <article
                    ref={contentRef}
                    className={clsx(
                      "prose prose-neutral max-w-none leading-relaxed",
                      "[&>h2]:scroll-mt-24 [&>h3]:scroll-mt-24 prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3",
                      "prose-img:rounded-xl prose-img:border prose-img:shadow-sm prose-a:underline-offset-4 hover:prose-a:underline"
                    )}
                    dangerouslySetInnerHTML={{ __html: safeHtml || "" }}
                  />

                  {/* sticky TOC + CTA */}
                  <aside className="order-first lg:order-none">
                    <div className="lg:sticky lg:top-24 lg:max-h-[70vh] lg:overflow-auto">
                      {toc.length > 0 && (
                        <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
                          <p className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">
                            {tt(t, "common.tableOfContents", "Mundarija")}
                          </p>
                          <ul className="space-y-2 text-sm">
                            {toc.map((item) => (
                              <li key={item.id} className={clsx(item.level >= 3 ? "pl-4" : "")}>
                                <a href={`#${item.id}`} className="line-clamp-2 text-muted-foreground transition hover:text-foreground">
                                  {item.text}
                                </a>
                              </li>
                            ))}
                          </ul>
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
    </>
  );
}
