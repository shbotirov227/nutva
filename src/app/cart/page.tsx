"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/CartItem";
import Container from "@/components/Container";
import { FormModal } from "@/components/FormModal";
import { useCartWithDiscounts } from "@/hooks/useCartWithDiscounts";
import { formatPrice } from "@/lib/formatPrice";
import EmptyCartImg from "@/assets/images/empty-cart-img.png";
import { useCart } from "@/context/CartContext";
import { Trash2, ChevronLeft, ShieldCheck, Truck } from "lucide-react";
import clsx from "clsx";

export default function CartPage() {
  const { t } = useTranslation();
  const { cart, total, originalTotal } = useCartWithDiscounts();
  const { removeAll } = useCart();

  // Free shipping logic (thresholdni real qiymatingizga moslang)
  const FREE_SHIPPING_THRESHOLD = 300_000; // so'm
  const progress = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const leftForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const savings = useMemo(() => Math.max(0, originalTotal - total), [originalTotal, total]);

  if (cart.length === 0) {
    return (
      <Container className="pt-28 pb-24">
        <div className="flex flex-col items-center">
          <Image
            src={EmptyCartImg}
            alt="Empty cart"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full m-auto max-w-[360px] h-full object-contain"
          />
          <h1 className="mt-6 text-2xl font-extrabold text-emerald-900">{t("common.emptyCart")}</h1>
          <p className="text-emerald-800/70 mt-2 text-sm">
            {t("common.emptyCartHint", "Mahsulotlarni ko‘rib chiqing va savatga qo‘shing.")}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-300 px-4 py-2 text-emerald-900 hover:bg-emerald-50 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            {t("common.continueShopping", "Xarid qilishni davom etish")}
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-28 pb-24">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900">
          {t("common.yourCart")}
        </h1>
        <Button
          size="lg"
          variant="outline"
          onClick={() => removeAll()}
          className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-5 h-5" />
          {t("common.clearCart")}
        </Button>
      </div>

      {/* Free shipping banner (clean + centered) */}
      <div className="mb-6 rounded-2xl border border-emerald-200/60 bg-white/80 shadow-sm px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 justify-center">
            <Truck className="w-5 h-5 text-emerald-700" />
            <span className="text-emerald-800 font-semibold text-center">
              {leftForFree === 0
                ? t("cart.freeShippingActive", "Bepul yetkazib berish faollashdi!")
                : t("cart.leftForFreeShipping", "Bepul yetkazib berish uchun qolgan summa:")}{" "}
              {leftForFree > 0 && (
                <span className="text-emerald-900">
                  {formatPrice(leftForFree)} {t("common.sum")}
                </span>
              )}
            </span>
          </div>
          <div className="h-2 w-full sm:w-1/2 rounded-full bg-emerald-100 overflow-hidden">
            <div
              className={clsx(
                "h-full rounded-full transition-all",
                progress >= 100 ? "bg-emerald-600" : "bg-emerald-400"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Items */}
        <section className="space-y-4">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Trust row */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-emerald-900/80 text-sm">
            <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>{t("cart.qualityAssurance", "Sifat nazorati (GMP)")}</span>
            </div>
            <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-3 flex items-center gap-2">
              <span>↩️</span>
              <span>{t("cart.returnPolicy", "Qaytarish siyosati: 7 kun")}</span>
            </div>
            <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-3 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span>{t("cart.fastDelivery", "Tez yetkazib berish")}</span>
            </div>
          </div>

          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-emerald-900 hover:text-emerald-800 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            {t("common.continueShopping", "Xarid qilishni davom etish")}
          </Link>
        </section>

        {/* Summary (sticky) */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <h2 className="text-xl font-extrabold text-emerald-900">
              {t("cart.orderSummary", "Buyurtma xulosasi")}
            </h2>

            {/* Price breakdown */}
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-emerald-900/80">{t("cart.subtotal", "Oraliq summa")}</span>
                <span className="font-semibold text-emerald-900">
                  {formatPrice(originalTotal)} {t("common.sum")}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900/80">{t("cart.savings", "Tejalgan summa")}</span>
                  <span className="font-semibold text-emerald-700">
                    − {formatPrice(savings)} {t("common.sum")}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-emerald-900/80">{t("cart.delivery", "Yetkazib berish")}</span>
                <span className="font-semibold text-emerald-900">
                  {leftForFree === 0 ? t("cart.free", "Bepul") : t("cart.calculatedAtNext", "Keyingi bosqichda")}
                </span>
              </div>

              <div className="h-px bg-emerald-100 my-2" />

              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-emerald-900">{t("common.total")}</span>
                <span className="text-2xl font-extrabold text-emerald-800">
                  {formatPrice(total)} {t("common.sum")}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <FormModal>
              <Button
                size="lg"
                className="mt-5 w-full font-bold"
                style={{ background: "linear-gradient(90deg, #10B981, #34D399)", color: "#fff" }}
              >
                {t("common.confirm")}
              </Button>
            </FormModal>

            <p className="mt-3 text-[12px] text-emerald-900/70 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              {t("cart.secureCheckout", "To‘lov xavfsiz va shifrlangan.")}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
