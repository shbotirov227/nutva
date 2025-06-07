"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
    id: string;
    title: string;
    slug: string;
    bgColor?: string;
    description: string;
    price?: number;
    image: string[];
    className?: string
    style?: React.CSSProperties,
    imagePriority?: boolean,
    index?: number,
    activeColor?: string
}

const ProductCard = ({
    id,
    title,
    slug,
    bgColor,
    description,
    image,
    className,
    style,
    imagePriority,
    index,
    activeColor
}: ProductCardProps) => {

    return (
        <div
            style={{ backgroundColor: bgColor ? bgColor : "white", ...style }}
            className={`w-full md:w-[100%] sm:w-[100%] h-[350px] shadow-[10px_15px_15px_rgba(0,0,0,0.1),_10px_15px_15px_rgba(0,0,0,0.1)] rounded flex lg:flex-row items-center justify-between ${className}`}
        >
            <div className="w-[55%] p-6">
                <h2 className="text-white text-4xl font-semibold mb-5">{title}</h2>
                <span className="text-white text-xl mb-16">{slug}</span>
                <p className="text-white text-md  mt-12 mb-5">{description}</p>
                <div className="mt-4 flex justify-start items-center gap-5">
                    <Link
                        href={`/products/${id}`}
                        style={{ color: activeColor }}
                        className="bg-white font-bold px-4 py-2 rounded-lg transition-all"
                    >
                        Купить
                    </Link>
                    <Link href={`/products/${id}`} className="text-white font-semibold bg-transparent underline p-5">
                        Подробнее
                    </Link>
                </div>
            </div>

            <div className="w-[55%]">
                {image?.length > 0 ? (
                    <Image
                        src={image[0]}
                        alt={`Product Image ${image[0]}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-56 object-contain rounded"
                        loading={index === 0 ? "eager" : "lazy"}
                        priority={imagePriority}
                        decoding="async"
                    />
                ) : (
                    <p className="text-gray-500">No image available</p>
                )}
            </div>

        </div>
    )
}

export default ProductCard;