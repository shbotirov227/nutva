"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/CartItem";
import Container from "@/components/Container";
import { FormModal } from "@/components/FormModal";
import { useCartWithDiscounts } from "@/hooks/useCartWithDiscounts";
import { formatPrice } from "@/lib/formatPrice";
import EmptyCartImg from "@/assets/images/empty-cart-img.png";
import { useCart } from "@/context/CartContext";

export default function CartPage() {

  const { t } = useTranslation();
  const { cart, total, originalTotal } = useCartWithDiscounts();
  const { removeAll } = useCart();
  
  return (
    <Container className="pt-32 pb-25">
      {cart.length > 0 ? (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t("common.yourCart")}</h1>
          <Button
            size="lg"
            onClick={() => removeAll()}
            className="cursor-pointer"
          >
            {t("common.clearCart")}
          </Button>
        </div>
      ) : null}

      {cart.length === 0 ? (
        <div>
          <Image
            src={EmptyCartImg}
            alt="No image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full m-auto max-w-[350px] h-full object-contain rounded-xl border shadow-none border-none"
          />
          <p className="text-muted-foreground text-xl text-center mt-10">{t("common.emptyCart")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              {originalTotal > total && (
                <p className="text-gray-500 text-lg line-through mt-1">
                  {formatPrice(originalTotal)} {t("common.sum")}
                </p>
              )}
              <p className="text-2xl font-bold text-red-600">
                {t("common.total")}: {formatPrice(total)} {t("common.sum")}
              </p>
            </div>
            <FormModal>
              <Button size="lg" className="cursor-pointer">{t("common.confirm")}</Button>
            </FormModal>
          </div>
        </>
      )}
    </Container>
  );
}
