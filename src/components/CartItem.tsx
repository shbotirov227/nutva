"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import NoImage from "@/assets/images/noimage.webp";
import { useTranslated } from "@/hooks/useTranslated";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { useTranslation } from "react-i18next";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function CartItem({ item }: { item: GetOneProductType & { quantity: number } }) {
  const { removeFromCart, updateQuantity } = useCart();
  const localized = useTranslated(item);
  const { t } = useTranslation();

  const formatPrice = (amount: number) => amount.toLocaleString("ru-RU") + " so'm";

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-5 border-1 border-gray-300 rounded-2xl bg-[#f9fafb] transition-all shadow-md hover:shadow-[5px_5px_5px_rgba(0,0,0,0.1),_5px_5px_5px_rgba(0,0,0,0.1)]">
      <div className="w-full md:w-[140px] flex justify-center md:justify-start">
        <Image
          src={item.imageUrls?.[0] || NoImage}
          alt={`Image of ${localized.name}`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full max-w-[120px] h-32 object-contain rounded-xl border border-gray-200 bg-white"
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
        <div className="flex flex-col text-center sm:text-left flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{localized.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="text-gray-700 font-medium">{t("common.price")}:</span> {formatPrice(item.price)}
          </p>
          <p className="text-sm text-gray-500">
            <span className="text-gray-700 font-medium">{t("common.total")}:</span> {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden p-1">
            <Button
              onClick={handleDecrement}
              className="px-3 py-1 bg-gray-200 text-black cursor-pointer hover:bg-gray-300 text-lg font-semibold"
            >
              <MinusIcon />
            </Button>
            <span className="px-4 py-1 text-md min-w-[40px] text-center">{item.quantity}</span>
            <Button
              onClick={handleIncrement}
              className="px-3 py-1 bg-gray-200 text-black cursor-pointer hover:bg-gray-300 text-lg font-semibold"
            >
              <PlusIcon />
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-500 border border-red-300 hover:bg-red-50 px-4 py-2 rounded-xl cursor-pointer"
          >
            {t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
