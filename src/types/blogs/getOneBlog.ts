export type BlogMediaType = {
  url: string;
  file: File | null;
  caption: string | null;
  altText: string | null;
  mediaType: "Image" | "Video" | "YoutubeUrl" | "ImageUrl";
};

export type GetOneBlogType = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  published: boolean;
  title: string;
  subtitle: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  media: BlogMediaType[];

  viewCount?: number;
  author?: string;
};
