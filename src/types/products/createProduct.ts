export type CreateProductType = {
  name: string;
  description: string;
  price: number;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  imageUrls: string[];
  token: string
};