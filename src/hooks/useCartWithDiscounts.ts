"use client";

import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useTranslated } from "@/hooks/useTranslated";
// import { useDiscount } from "@/hooks/useDiscount";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { getDiscount } from "@/lib/getDiscount"; // eski useDiscount emas

type EnrichedCartItem = GetOneProductType & {
  quantity: number;
  translatedName: string;
  discount: {
    basePrice: number;
    pricePerUnit: number;
    totalPrice: number;
    discountPercent: number;
  };
};

export function useCartWithDiscounts(): {
  cart: EnrichedCartItem[];
  total: number;
} {
  const { cart } = useCart();

  const translatedCart = useTranslated(cart);


  const enrichedCart = useMemo(() => {
    return cart.map((item, index) => {
      const translatedName = translatedCart[index]?.name || item.en.name;
      const discount = getDiscount(item.slug, item.quantity);

      return {
        ...item,
        translatedName,
        discount,
      };
    });
  }, [cart, translatedCart]);
  

  const total = useMemo(
    () => enrichedCart.reduce((sum, item) => sum + item.discount.totalPrice, 0),
    [enrichedCart]
  );

  return { cart: enrichedCart, total };
}
