/* eslint-disable @typescript-eslint/no-explicit-any */
interface StructuredDataProps {
  type: "Article" | "Organization" | "WebSite" | "BreadcrumbList";
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Foydalanish misoli:
export function ArticleStructuredData({
  title,
  description,
  author,
  publishDate,
  image,
}: {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  image?: string;
}) {
  const articleData = {
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished: publishDate,
    dateModified: publishDate,
    image: image ? [image] : undefined,
  };

  return <StructuredData type="Article" data={articleData} />;
}
