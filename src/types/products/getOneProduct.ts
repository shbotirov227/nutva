export type GetOneProductType = {
  id: string;
  en: {
    name: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  uz: {
    name: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  ru: {
    name: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  price: number;
  slug: string;
  createdAt: string;
  viewCount: number;
  buyClickCount: number;
  imageUrls: string[];
  updatedAt: string;
};