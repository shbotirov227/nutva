"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import NoImage from "@/assets/images/noimage.webp";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { useTranslation } from "react-i18next";
import { X, Equal, MinusIcon, PlusIcon, ShieldCheck, Leaf } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useMemo } from "react";
import { getFirstNormalizedImage } from "@/lib/imageUtils";

type Discount = {
  basePrice: number;     // bir dona uchun nominal narx (chegirmasiz)
  pricePerUnit: number;  // bir dona uchun joriy narx (chegirmali)
  totalPrice: number;    // quantity * pricePerUnit
  discountPercent: number;
};

type Props = {
  item: GetOneProductType & {
    quantity: number;
    discount: Discount;
  };
};

export default function CartItem({ item }: Props) {
  const { removeFromCart, updateQuantity } = useCart();
  const { t } = useTranslation();

  const { basePrice, pricePerUnit, totalPrice, discountPercent } = item.discount;

  const canDecrement = item.quantity > 1;

  const savings = useMemo(() => {
    const withoutDiscount = basePrice * item.quantity;
    const saved = Math.max(0, withoutDiscount - totalPrice);
    return { withoutDiscount, saved };
  }, [basePrice, item.quantity, totalPrice]);

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => {
    if (canDecrement) updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <article
      className="relative grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5 p-4 sm:p-5 rounded-2xl border border-emerald-200/60 bg-white/80 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/70"
  aria-label={`${item.name} ${t("common.inCart")}`}
    >
      {/* Image + badges */}
      <div className="relative flex items-center justify-center sm:justify-start">
        <div className="relative">
          <Image
            src={getFirstNormalizedImage(item.imageUrls, NoImage.src)}
            alt={`${item.name} — image`}
            width={180}
            height={180}
            className="w-[150px] sm:w-[180px] h-[150px] object-contain rounded-xl border border-emerald-100 bg-white"
          />
          <div className="absolute -left-2 -top-2 flex flex-col gap-1">
            {discountPercent > 0 && (
              <span className="rounded-full bg-rose-600 text-white px-2.5 py-1 text-xs font-bold shadow">
                −{discountPercent}%
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-emerald-900 px-2.5 py-1 text-[11px] font-semibold shadow border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              ISO
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-950 break-words">
            {item.name}
          </h3>

          {/* Micro trust */}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-emerald-900/70">
            <span className="inline-flex items-center gap-1">
              <Leaf className="w-4 h-4" /> {t("product.natural")}
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> {t("cart.qualityAssurance")}
            </span>
          </div>

          {/* Price row with stable “Tejaldi” slot */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto] md:items-center gap-2">
            {/* Left side: unit × qty and old total */}
            <div className="flex flex-wrap items-center text-sm sm:text-base text-emerald-900">
              <span className="font-medium">{t("common.price")}:</span>
              <span className="font-semibold ml-2">
                {formatPrice(pricePerUnit)} {t("common.sum")}
              </span>

              {item.quantity > 1 && (
                <span className="font-semibold mx-2 inline-flex items-center">
                  <X size={18} className="mx-1 opacity-70" />
                  {item.quantity}
                  <Equal size={18} className="mx-1 opacity-70" />
                </span>
              )}

              {discountPercent > 0 && (
                <span className="text-gray-400 line-through">
                  {formatPrice(savings.withoutDiscount)} {t("common.sum")}
                </span>
              )}
            </div>

            {/* Right side: reserved badge slot (prevents shifting) */}
            <div className="md:justify-self-end">
              <div className="min-w-[170px] flex justify-end">
                {discountPercent > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-yellow-300/90 text-black px-3 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {t("cart.saved")}: {formatPrice(savings.saved)} {t("common.sum")}
                  </span>
                ) : (
                  // placeholder to keep width stable (invisible)
                  <span className="inline-block px-3 py-1 text-xs opacity-0 select-none">
                    placeholder
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-2 text-sm sm:text-lg">
            <span className="text-emerald-900 font-medium">{t("common.total")}:</span>{" "}
            <span className="text-emerald-700 font-extrabold">
              {formatPrice(totalPrice)} {t("common.sum")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Stepper */}
          <div className="inline-flex items-center border border-emerald-200 rounded-xl overflow-hidden bg-white">
            <Button
              onClick={handleDecrement}
              disabled={!canDecrement}
              aria-label={t("common.decreaseQuantity") as string}
              className="px-3 py-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
              variant="ghost"
            >
              <MinusIcon className="w-5 h-5" />
            </Button>
            <span
              className="px-5 py-2 text-base min-w-[48px] text-center tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {item.quantity}
            </span>
            <Button
              onClick={handleIncrement}
              aria-label={t("common.increaseQuantity") as string}
              className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Remove */}
          <Button
            variant="secondary"
            onClick={() => removeFromCart(item.id)}
            aria-label={t("common.delete") as string}
            className="text-sm font-semibold text-red-600 border border-red-300 hover:bg-red-50 px-4 py-2 rounded-xl"
          >
            {t("common.delete")}
          </Button>
        </div>
      </div>

      {/* Decorative accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 -right-6 -bottom-8 h-40 w-40 rounded-full blur-3xl opacity-25 bg-emerald-300"
      />
    </article>
  );
}
