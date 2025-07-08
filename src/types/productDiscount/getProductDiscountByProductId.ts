export type GetProductDiscountByProductId = {
  id: string;
  productId: string;
  boxCount: number;
  discountLabel: string;
  discountPercent: number;
}[];