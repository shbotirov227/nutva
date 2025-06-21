// export type GetOneBlogType = {
//   id: string,
//   title: string,
//   content: string,
//   slug: string,
//   metaTitle: string,
//   metaDescription: string,
//   metaKeywords: string,
//   createdAt: Date,
//   viewCount: number,
//   imageUrls: string[]
// }

// types/blogs/getAllBlogs.ts
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
};
