export type GetAllProductsType = {
  id: string,
  name: string,
  description: string,
  metaTitle: string,
  metaDescription: string,
  metaKeywords: string,
  price: number,
  slug: string,
  viewCount: number,
  buyClickCount: number,
  imageUrls: string[]
}[];