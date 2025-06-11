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
        <Card className="w-[80%] min-h-[100%] border-2 shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)] rounded-xl hover:shadow-[10px_10px_10px_rgba(0,0,0,0.2),_10px_10px_10px_rgba(0,0,0,0.2)] transition-shadow duration-300 flex flex-col border-none">
            <Link href={url} rel="noopener noreferrer" className="block rounded-xl mx-5 border overflow-hidden">
                <Image
                    src={imgUrl || "/hero-bg.webp"}
                    alt={`Blog Image ${id}`}
                    width={0}
                    height={0}
                    className="w-[100%] h-[300px] object-cover rounded-xl box-border"
                />
            </Link>

            <CardHeader className="px-6 pt-2">
                <CardTitle>
                    <h2 className="text-2xl text-[#1C1917] font-semibold leading-8">
                        {title}
                    </h2>
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-4 text-[#44403C] text-lg flex-grow">
                <p>{content}</p>
            </CardContent>

            <CardFooter className="px-6 pb-6">
                <Link
                    href={url}
                    rel="noopener noreferrer"
                    className="text-sm py-2 px-3 bg-[#218A4F] text-white hover:bg-[#365343] transition-all cursor-pointer rounded-md"
                >
                    Read More
                </Link>
            </CardFooter>
        </Card>
    );
};

export default BlogCard;
