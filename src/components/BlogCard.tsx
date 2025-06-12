import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";

type BlogCardProps = {
  id: string;
  url: string;
  imgUrl: string;
  title: string;
  content: string;
};

const BlogCard = ({ id, url, imgUrl, title, content }: BlogCardProps) => {
  return (
    <Card className="w-full max-w-[400px] min-h-[440px] border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white">
      <Link
        href={url}
        rel="noopener noreferrer"
        className="block relative aspect-[16/9] w-full rounded-t-2xl overflow-hidden"
        tabIndex={-1}
      >
        <Image
          src={imgUrl || "/hero-bg.webp"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={id === "0"}
          sizes="(max-width: 600px) 100vw, 400px"
        />
      </Link>

      <CardHeader className="px-6 pt-3 pb-2">
        <CardTitle>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1917] leading-8 line-clamp-2">
            {title}
          </h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-2 text-[#44403C] text-base sm:text-lg flex-grow">
        <p className="line-clamp-3">{content}</p>
      </CardContent>

      <CardFooter className="px-6 pb-6 mt-auto">
        <Link
          href={url}
          rel="noopener noreferrer"
          className="inline-block text-sm py-2 px-4 bg-[#218A4F] text-white hover:bg-[#365343] transition-all rounded-lg font-medium focus:outline-none focus-visible:ring-2 ring-[#218A4F]"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
