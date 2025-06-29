import { useMemo } from "react";
import { DISCOUNT_TABLE } from "@/constants/discountTable";
import { ProductName } from "@/types/enums";

export function useDiscount(slug: string | undefined, quantity: number) {
  return useMemo(() => {
    if (!slug) {
      return {
        pricePerUnit: 0,
        totalPrice: 0,
        discountPercent: 0,
        basePrice: 0
      };
    }

    // const productKey = slug.toUpperCase();
    const productKey = (Object.entries(ProductName).find(
      ([, value]) => value.toLowerCase() === slug.toLowerCase()
    )?.[0] || "") as keyof typeof ProductName;
    
    const table = DISCOUNT_TABLE[productKey];

    if (!table) {
      return {
        pricePerUnit: 0,
        totalPrice: 0,
        discountPercent: 0,
        basePrice: 0
      };
    }

    console.log(productKey)

    const quantityKey = quantity >= 5 ? 5 : quantity >= 3 ? 3 : quantity >= 2 ? 2 : 1;

    const basePrice = table[1];
    const discountedPrice = table[quantityKey];

    const discountPercent = Math.round(
      ((basePrice - discountedPrice) / basePrice) * 100
    );

    const totalPrice = discountedPrice * quantity;

    return {
      basePrice,
      pricePerUnit: discountedPrice,
      totalPrice,
      discountPercent,
    };
  }, [slug, quantity]);
}
