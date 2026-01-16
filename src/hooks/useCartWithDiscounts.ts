type RawCartItem = GetOneProductType & { quantity: number };

import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { getDiscount } from "@/lib/getDiscount";


type EnrichedCartItem = RawCartItem & {
  translatedName: string;
  discount: {
    basePrice: number;
    pricePerUnit: number;
    totalPrice: number;
    discountPercent: number;
  };
};

type UseCartWithDiscountsResult = {
  cart: EnrichedCartItem[];
  total: number;
  originalTotal: number;
};


export function useCartWithDiscounts(): UseCartWithDiscountsResult {
  const { cart } = useCart();

  const globalCartQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const enrichedCart = useMemo(() => {
    return cart.map((item) => {
      const discount = getDiscount(item.name, item.quantity, globalCartQuantity);
      return {
        ...item,
        translatedName: item.name,
        discount,
      };
    });
  }, [cart, globalCartQuantity]);

  const total = useMemo(
    () => enrichedCart.reduce((sum, item) => sum + item.discount.totalPrice, 0),
    [enrichedCart]
  );

  const originalTotal = useMemo(
    () =>
      enrichedCart.reduce(
        (sum, item) => sum + item.discount.basePrice * item.quantity,
        0
      ),
    [enrichedCart]
  );



  return {
    cart: enrichedCart,
    total,
    originalTotal,
  };
}
