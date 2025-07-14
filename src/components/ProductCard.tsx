"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import NoImage from "@/assets/images/noimage.webp";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import { GetOneProductType } from "@/types/products/getOneProduct";
// import { ProductName } from "@/types/enums";
import { FormModal } from "./FormModal";

type ProductCardProps = {
  id: string;
  title: string;
  slug: string;
  bgColor?: string;
  description: string;
  price?: number;
  image: string[];
  className?: string;
  style?: React.CSSProperties;
  imagePriority?: boolean;
  index?: number;
  activeColor?: string;
  addToCart?: () => void;
  product?: GetOneProductType;
};

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
  activeColor,
  product
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity: 1 });
    toast.success(t("product.addedToCart"), {
      position: "top-center",
      autoClose: 1200,
    });
  };

  // const excludedProduct = product?.name === ProductName.VIRIS_MEN || product?.name === ProductName.FERTILIA_WOMEN;

  return (
    <div
      style={{ backgroundColor: bgColor || "white", ...style }}
      className={`w-full relative rounded-xl max-[1024px]:w-[500px] min-h-[400px] max-[950px]:mt-30 max-[950px]:w-[450px] max-[800px]:w-[350px] flex flex-col-reverse lg:flex-row items-center justify-between shadow-lg ${className}`}
    >
      <div className="w-full px-6 pt-6 pb-10 lg:text-left flex flex-col gap-6">
        <div>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">{title}</h2>
          <span className="text-white text-lg sm:text-xl mb-4 block">{slug}</span>
          <p className="text-white text-sm sm:text-base md:text-md">{description}</p>
        </div>

        {product ? (
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
            {product && (
              <FormModal products={[{ productId: product.id, quantity: 1 }]}>
                <Button
                  size="lg"
                  style={{ color: activeColor }}
                  className="bg-white text-black font-bold hover:!bg-white px-6 py-2 rounded-lg transition-all w-full sm:w-auto text-center cursor-pointer"
                >
                  {t("common.buy")}
                </Button>
              </FormModal>
            )}

            <Button
              size="lg"
              onClick={handleAddToCart}
              className="w-full sm:w-auto text-center cursor-pointer"
            >
              {t("product.addToCart")}
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="text-white text-lg md:text:xl font-semibold">{t("common.soon")}</h2>
          </div>
        )}


        {/* More link at bottom on mobile */}
        <div className="block sm:hidden text-center mt-2">
          <Link
            href={`/product/${id}`}
            className="text-white font-semibold underline px-6 py-2 block"
          >
            {t("common.more")}
          </Link>
        </div>

        {/* More link on desktop */}
        <div className="hidden sm:block mt-2">
          <Link
            href={`/product/${id}`}
            className="text-white font-semibold underline px-6 py-2 inline-block"
          >
            {t("common.more")}
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex justify-center items-center p-6 pt-10 lg:pt-6">
        {image?.length > 0 ? (
          <Image
            src={image[0]}
            alt={`Product Image ${image[0]}`}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full min-w-[300px] max-[950px]:absolute -top-30 h-56 object-contain"
            loading={index === 0 ? "eager" : "lazy"}
            priority={imagePriority}
            decoding="async"
          />
        ) : (
          <Image
            src={NoImage}
            alt="No Image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full max-w-[300px] h-56 object-contain"
            loading={index === 0 ? "eager" : "lazy"}
            priority={imagePriority}
            decoding="async"
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
