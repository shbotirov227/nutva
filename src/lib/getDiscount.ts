import { DISCOUNT_TABLE } from "@/constants/discountTable";
import { ProductName } from "@/types/enums";

export function getDiscount(
  slug: string | undefined,
  quantity: number,
  globalQuantity?: number
) {
  console.log("Discount check:", { slug, quantity, globalQuantity });

  if (!slug) {
    return {
      pricePerUnit: 0,
      totalPrice: 0,
      discountPercent: 0,
      basePrice: 0,
    };
  }

  const productKey = (Object.entries(ProductName).find(
    ([, value]) => value.toLowerCase() === slug.toLowerCase()
  )?.[0] || "") as keyof typeof ProductName;

  const table = DISCOUNT_TABLE[productKey];

  if (!table) {
    return {
      pricePerUnit: 0,
      totalPrice: 0,
      discountPercent: 0,
      basePrice: 0,
    };
  }

  const qty = globalQuantity ?? quantity;
  const quantityKey = qty >= 5 ? 5 : qty >= 3 ? 3 : qty >= 2 ? 2 : 1;

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
}
