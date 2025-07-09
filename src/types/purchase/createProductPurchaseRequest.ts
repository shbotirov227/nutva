export type CreateProductPurchaseRequest = {
  buyerName: string;
  // age: number;
  // forWhom: string;//
  // problem: string;
  region: string;
  phone: string;
  comment: string;
  products: {
    productId: string;
    quantity: number;
  }[]
};
