"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { useTranslation } from "react-i18next";
import { useLocalizedProduct } from "@/hooks/useLocalizedProduct";
import { formatPrice } from "@/lib/formatPrice";
import { Flame } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { FormModal } from "./FormModal";
import { cn } from "@/lib/utils";
// import SuccessModal from "./SuccessModal";

interface Props {
  product: GetOneProductType;
  bgColor: string | undefined;
  color: string | undefined;
  onClick?: () => void;
}

const quantityOptions = [1, 2, 3];

const DISCOUNT_TABLE: Record<string, { two: number; threePlus: number }> = {
  VIRIS: { two: 16.7, threePlus: 27.8 },
  FERTILIA: { two: 16.7, threePlus: 27.8 },
  GELMIN: { two: 20, threePlus: 34 },
  COMPLEX: { two: 22.7, threePlus: 36.4 },
  EXTRA: { two: 22.7, threePlus: 36.4 },
};

export default function ProductPriceCard({ product, bgColor, color, onClick }: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();
  const { lang } = useLang();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSuccess = () => {
    setShowFormModal(false);
    setShowSuccessModal(true);
  };

  const localizedProduct = useLocalizedProduct(product, lang);
  // const productKey = product?.slug?.toUpperCase();

  const { pricePerUnit, totalPrice, discountPercent } = useMemo(() => {
    const basePrice = product.price;
    const productKey = product?.slug?.toUpperCase() || "";

    const discounts = DISCOUNT_TABLE[productKey] || { two: 0, threePlus: 0 };

    let discount = 0;
    if (quantity === 2) {
      discount = discounts.two;
    } else if (quantity >= 3) {
      discount = discounts.threePlus;
    }

    const pricePerUnit = Math.round(basePrice * (1 - discount / 100));
    const totalPrice = pricePerUnit * quantity;

    return {
      pricePerUnit,
      totalPrice,
      discountPercent: discount,
    };
  }, [quantity, product.price, product?.slug]);

  const handleClick = () => {
    setShowFormModal(true);
    if (onClick) {
      onClick();
      toast.success("Product buyed!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  if (!product) return null;
  if (!mounted) return null;

  return (
    <Card
      style={{ backgroundColor: bgColor, borderColor: color }}
      className="rounded-2xl p-6 w-full text-black shadow-[0_10px_20px_rgba(0,0,0,0.6)] border-1"
    >
      <CardContent className="p-0">
        <div className="mb-4">
          <h2 className="text-4xl font-bold">{localizedProduct?.name}</h2>
          <p className="text-xl mt-1 text-gray-800">{product?.slug}</p>
        </div>

        {discountPercent > 0 && (
          <div className="flex gap-2 items-center mb-4">
            <Badge className="bg-yellow-400 text-black text-base font-semibold px-2 py-1 rounded-full">
              -{discountPercent}%
            </Badge>
            <Badge className="bg-yellow-400 text-black text-base font-semibold px-2 py-1 rounded-full">
              {t("sale", "Распродажа")}
            </Badge>
          </div>
        )}

        <div style={{ backgroundColor: bgColor }} className="rounded-xl p-4 mb-4">
          <div className="flex items-center text-base font-semibold text-red-600 gap-1 mb-4 bg-white p-4 rounded-lg">
            <Flame className="w-4 h-4" />
            {t("common.forYou")} {discountPercent}% {t("common.sale")} • {quantity} {t("common.quantity")}
          </div>

          <div className="flex justify-between bg-white rounded-lg p-4">
            {quantityOptions.map((q) => (
              <Button
                key={q}
                variant="ghost"
                onClick={() => setQuantity(q)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = color || "transparent";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  if (quantity !== q) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#1f2937";
                  }
                }}
                style={{
                  backgroundColor: quantity === q ? color : "transparent",
                  color: quantity === q ? "white" : "#1f2937",
                }}
                className="flex-1 text-sm mx-1 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm  border-1"
              >
                {q} {t("common.quantity")}
              </Button>
            ))}

            <div className="flex items-center justify-center ml-5">
              <Button style={{ backgroundColor: color }} className="cursor-pointer" onClick={() => setCount(count - 1)}>
                -
              </Button>

              <p className="mx-5">{count}</p>

              <Button style={{ backgroundColor: color }} className="cursor-pointer" onClick={() => setCount(count + 1)}>
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="text-pink-600 text-3xl font-bold mb-4">
          {formatPrice(totalPrice)} {t("common.sum", "so'm")}
        </div>

        <FormModal
          onClose={() => setShowFormModal(false)}
          onSuccess={handleSuccess}
        >
          <Button
            size="lg"
            onClick={handleClick}
            style={{ backgroundColor: color }}
            className={cn(
              bgColor ? `bg-${bgColor}` : null,
              "w-full text-white text-lg font-semibold py-3 rounded-lg cursor-pointer  transition-all"
            )}
          >
            {t("common.buy")}
          </Button>
        </FormModal>

        {/* {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )} */}

      </CardContent>
    </Card>
  );
}
