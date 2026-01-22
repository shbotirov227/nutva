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

  // const qty = globalQuantity ?? quantity;
  // const quantityKey = qty >= 5 ? 5 : qty >= 3 ? 3 : qty >= 2 ? 2 : 1;

  // const basePrice = table[1];
  // const discountedPrice = table[quantityKey];

  // const discountPercent = Math.round(
  //   ((basePrice - discountedPrice) / basePrice) * 100
  // );

  // const totalPrice = discountedPrice * quantity;

  // Complex mahsuloti uchun maxsus logika: 3+ dona 500,000 so'm/dona
  if (productKey === "COMPLEX" && quantity >= 3) {
    const basePrice = table[1].price;
    const pricePerUnit = 500000;
    const totalPrice = pricePerUnit * quantity;
    const discountPercent = Math.round(
      ((basePrice - pricePerUnit) / basePrice) * 100
    );

    return {
      basePrice,
      pricePerUnit,
      totalPrice,
      discountPercent,
    };
  }

  // Boshqa mahsulotlar uchun oddiy logika
  let quantityKey = 1;
  if (quantity >= 5 && table[5]) quantityKey = 5;
  else if (quantity >= 3 && table[3]) quantityKey = 3;
  else if (quantity >= 2 && table[2]) quantityKey = 2;

  const selected = table[quantityKey];
  const basePrice = table[1].price;

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
  };
}
