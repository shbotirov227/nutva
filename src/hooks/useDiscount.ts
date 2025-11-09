"use client";

import { useMemo } from "react";
import { DISCOUNT_TABLE } from "@/constants/discountTable";
import { ProductName } from "@/types/enums";

// export function useDiscount(slug: string | undefined, quantity: number) {
//   return useMemo(() => {
//     if (!slug) {
//       return {
//         pricePerUnit: 0,
//         totalPrice: 0,
//         discountPercent: 0,
//         basePrice: 0
//       };
//     }

//     // const productKey = slug.toUpperCase();
//     const productKey = (Object.entries(ProductName).find(
//       ([, value]) => value.toLowerCase() === slug.toLowerCase()
//     )?.[0] || "") as keyof typeof ProductName;
    
//     const table = DISCOUNT_TABLE[productKey];

//     if (!table) {
//       return {
//         pricePerUnit: 0,
//         totalPrice: 0,
//         discountPercent: 0,
//         basePrice: 0
//       };
//     }

//     console.log(productKey)

//     const quantityKey = quantity >= 5 ? 5 : quantity >= 3 ? 3 : quantity >= 2 ? 2 : 1;

//     const basePrice = table[1];
//     const discountedPrice = table[quantityKey];

//     const discountPercent = Math.round(
//       ((basePrice - discountedPrice) / basePrice) * 100
//     );

//     const totalPrice = discountedPrice * quantity;

//     return {
//       basePrice,
//       pricePerUnit: discountedPrice,
//       totalPrice,
//       discountPercent,
//     };
//   }, [slug, quantity]);
// }


export function useDiscount(slug: string | undefined, quantity: number) {
  return useMemo(() => {
    if (!slug) {
      return {
        basePrice: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        discountPercent: 0,
        boxPrice: 0,
      };
    }

    // ProductName enum orqali to‘g‘ri keyni olish
    const productKey = (Object.entries(ProductName).find(
      ([, value]) => value.toLowerCase() === slug.toLowerCase()
    )?.[0] || "") as keyof typeof ProductName;

    const table = DISCOUNT_TABLE[productKey];
    if (!table) {
      return {
        basePrice: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        discountPercent: 0,
        boxPrice: 0,
      };
    }

    // mos quantity topish (jadvalda mavjud bo‘lgan eng katta variantni tanlash)
    let quantityKey = 1;
    if (quantity >= 5 && table[5]) quantityKey = 5;
    else if (quantity >= 3 && table[3]) quantityKey = 3;
    else if (quantity >= 2 && table[2]) quantityKey = 2;

    const selected = table[quantityKey];
    const basePrice = table[1].price;

    // Jadvaldagi foiz qiymatini ishlatish (agar mavjud bo‘lmasa, avtomatik hisoblaydi)
    const discountPercent =
      selected.discount ??
      Math.round(((basePrice - selected.price) / basePrice) * 100);

    const pricePerUnit = selected.price;
    const totalPrice = pricePerUnit * quantity;

    return {
      basePrice,
      pricePerUnit,
      totalPrice,
      discountPercent,
      boxPrice: selected.boxPrice || 0,
    };
  }, [slug, quantity]);
}
