

import Container from "@/components/Container";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
};

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${params.slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return {};

    const post: GetOneBlogType = await res.json();

    return {
      title: post?.metaTitle || post?.title,
      description: post?.metaDescription || post?.content?.slice(0, 150),
      keywords: post?.metaKeywords?.split(",") || [],
      openGraph: {
        title: post?.metaTitle || post?.title,
        description: post?.metaDescription || post?.content?.slice(0, 150),
        images: post?.media?.length ? [post?.media[0]] : [],
      },
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/BlogPost/${params.slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error fetching blog post:", res.statusText);
      return notFound();
    }


    const post: BlogPost = await res.json();
    <pre>{JSON.stringify(post, null, 2)}</pre>
    
    return (
      <Container className="pt-32">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{post.title}</h1>

          {post.createdAt && (
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString("uz-UZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {/* Barcha rasmni ko‘rsatish */}
          {post.imageUrls?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.imageUrls.map((img, index) => (
                <Image
                  key={index}
                  src={
                    img.startsWith("http")
                      ? img
                      : `https://www.nutvahealth.uz/uploads/${img}`
                  }
                  alt={`Blog Image ${index + 1}`}
                  className="w-full max-h-[400px] object-cover rounded"
                  width={500}
                  height={300}
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {typeof post.content === "string" && post.content.trim() !== "" ? (
            <div
              className="prose max-w-none prose-lg"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(post.content) }}
            />
          ) : (
            // <p className="text-red-500 font-semibold">Kontent mavjud emas.</p>
            <pre>{JSON.stringify(post, null, 2)}</pre>
          )}
          {post.metaKeywords && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Meta Keywords:</h2>
              <p className="text-gray-600">{post.metaKeywords}</p>
            </div>
          )}
        </div>
      </Container>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return notFound();
  }
}

// "use client";

// import Container from "@/components/Container";
// import { apiClient } from "@/lib/apiClient";
// import { GetOneBlogType } from "@/types/blogs/getOneBlog";
// import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";
// import { notFound, useParams } from "next/navigation";

// type BlogPost = {
//   id: string;
//   title: string;
//   content: string;
//   imageUrls: string[];
// };


// export default function BlogPostPage() {

//   const params = useParams<{ slug: string }>();

//   const { data: post = {} as GetOneBlogType } = useQuery({
//     queryKey: ["post", params.slug],
//     queryFn: () => apiClient.getOneBlog(params.slug),
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 5,
//   });

//   // try {
//   //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/BlogPost/${params.slug}`, {
//   //     next: { revalidate: 60 },
//   //   });

//   //   if (!res.ok) {
//   //     console.error("Error fetching blog post:", res.statusText);
//   //     return notFound();
//   //   }

//   //   const post = await res.json();

//   //   console.log("Fetched blog post:", post);
    
//   // } catch (error) {
//   //   console.error("Error fetching blog post:", error);
//   //   return notFound();
//   // }

//   console.log("Blog post data:", post);

//   return (
//     <Container className="pt-32">
//       <div className="space-y-6">
//         <h1 className="text-4xl font-bold">{post.uz.title}</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {post.uz.media?.map((img, index) => (
//             <Image
//               key={index}
//               src={
//                 img.startsWith("http")
//                   ? img
//                   : `https://www.nutvahealth.uz/uploads/${img}`
//               }
//               alt={`Blog Image ${index + 1}`}
//               className="w-full max-h-[400px] object-cover rounded"
//               width={500}
//               height={300}
//               loading="lazy"
//             />
//           ))}
//         </div>

//         <p className="text-lg whitespace-pre-line">{post.uz.content}</p>
//       </div>
//     </Container>
//   );
// }