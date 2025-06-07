export type CreateBlogType = {
    title: string,
    content: string,
    slug: string,
    metaTitle: string,
    metaDescription: string,
    metaKeywords: string,
    imageUrls: File[] | Base64URLString[] | string[],   
}