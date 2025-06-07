export type GetOneBlogType = {
    id: string,
    title: string,
    content: string,
    slug: string,
    metaTitle: string,
    metaDescription: string,
    metaKeywords: string,
    createdAt: Date,
    viewCount: number,
    imageUrls: string[]
}