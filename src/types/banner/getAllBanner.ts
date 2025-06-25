export type GetAllBannerType = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;

  en: {
    id: string;
    title: string;
    subtitle: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    link: string;
    imageUrls: string[]
  }

  uz: {
    id: string;
    title: string;
    subtitle: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    link: string;
    imageUrls: string[]
  };

  ru: {
    id: string;
    title: string;
    subtitle: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    link: string;
    imageUrls: string[]
  };
}[];