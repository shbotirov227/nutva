"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/CartItem";
import Container from "@/components/Container";
import Image from "next/image";
import EmptyCartImg from "@/assets/images/empty-cart-img.png";
import { useTranslation } from "react-i18next";
import { useDiscount } from "@/hooks/useDiscount";
import { useTranslated } from "@/hooks/useTranslated";
import { formatPrice } from "@/lib/formatPrice";
import { FormModal } from "@/components/FormModal";

export default function CartPage() {
  const { cart } = useCart();
  const { t } = useTranslation();

  const cartWithDiscounts = cart.map((item) => {
    const discount = useDiscount(item.slug, item.quantity);
    const translated = useTranslated(item);

    return {
      ...item,
      ...discount,
      translated,
    };
  });

  const total = cartWithDiscounts.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Container className="pt-32 pb-25">
      {cart.length > 0 ? (
        <h1 className="text-3xl font-bold mb-6">{t("common.yourCart")}</h1>
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
            {cartWithDiscounts.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-semibold">{t("common.total")}: {formatPrice(total)}</p>
            <FormModal productId={cartWithDiscounts[0].id} quantity={cartWithDiscounts[0].quantity}>
              <Button size="lg" className="cursor-pointer">{t("common.confirm")}</Button>
            </FormModal>
          </div>
        </>
      )}
    </Container>
  );
}
