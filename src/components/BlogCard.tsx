import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { BlogMediaType } from "@/types/blogs/getOneBlog";
import DefaultImg from "@/assets/images/default-img.png";
// import { ArrowUpRight } from "lucide-react";

type BlogCardProps = {
  id: string;
  // url: string;
  imgUrl?: string;
  media: BlogMediaType | null;
  title: string;
  content: string;
  icon?: boolean;
};

function convertYouTubeLinkToEmbed(url: string) {
  if (url.includes("youtu.be")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  }
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
}

const BlogCard = ({
  id,
  media,
  title,
  content,
}: // icon
BlogCardProps) => {
  const isYouTube = media?.mediaType === "YoutubeUrl";
  const isImage =
    media?.mediaType === "Image" || media?.mediaType === "ImageUrl";

  return (
    <Card className="bg-[#FFF7ED] w-full min-h-full shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)] rounded-xl hover:shadow-[10px_10px_10px_rgba(0,0,0,0.2),_10px_10px_10px_rgba(0,0,0,0.2)] transition-shadow duration-300 border-1 box-border">
      <Link
        href={`/blog/${id}`}
        rel="noopener noreferrer"
        className="block rounded-xl mx-5 border overflow-hidden"
      >
        <div className="w-full h-[200px]">
          {isYouTube && media?.url && (
            <iframe
              src={convertYouTubeLinkToEmbed(media.url)}
              width="100%"
              height="200"
              title="YouTube Video"
              allowFullScreen
              className="w-full h-full object-cover"
            />
          )}

          {isImage && media?.url && (
            <Image
              src={media.url ? media.url : DefaultImg}
              alt={media.altText || "Blog image"}
              width={500}
              height={200}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Link>

      <CardHeader className="px-6 pt-3 pb-2">
        <CardTitle>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1917] leading-8 line-clamp-3">
            {title}
          </h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-2 text-[#44403C] text-base sm:text-lg flex-grow">
        <p className="line-clamp-3">{content}</p>
      </CardContent>

      <CardFooter className="px-6 pb-6 mt-auto">
        <Link
          href={`/blog/${id}`}
          rel="noopener noreferrer"
          className="inline-block text-sm py-2 px-4 bg-[#218A4F] text-white hover:bg-[#365343] transition-all rounded-lg font-medium focus:outline-none focus-visible:ring-2 ring-[#218A4F] mt-auto"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
