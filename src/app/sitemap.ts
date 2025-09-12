import { MetadataRoute } from "next"
import { apiClient } from "@/lib/apiClient"

const BASE_URL = "https://nutva.uz"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/product",
    "/about-us", 
    "/contact",
    "/blog",
    "/sale",
    "/certificates",
  ]

  const languages = ["uz", "ru", "en"]
  
  // API dan mahsulotlarni olish
  let products: { id: string }[] = []
  try {
    products = await apiClient.getAllProducts("uz") // Har doim uz tilida ID'lar bir xil
  } catch (error) {
    console.error("Error fetching products for sitemap:", error)
    // Fallback mahsulot ID'lari
    products = [
      { id: "2ca86164-5e10-449d-a854-b80f0173a3f5" },
      { id: "0406b946-cd9a-4171-91e2-e9f3e3016596" },
      { id: "f3146c53-0e85-49d3-8a8f-017fc7baa97c" },
      { id: "09de8997-9a58-429d-ba9f-8ac06c6dac05" },
      { id: "fcda59dd-a987-483b-9f82-9d937b004807" },
    ]
  }

  // API dan bloglarni olish
  let blogs: { id: string }[] = []
  try {
    blogs = await apiClient.getAllBlogs("uz") // Har doim uz tilida ID'lar bir xil
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error)
    blogs = [] // Blog yo'q bo'lsa bo'sh array
  }

  const sitemap: MetadataRoute.Sitemap = []

  // Har bir til uchun static pages
  languages.forEach(lang => {
    staticPages.forEach(page => {
      const route = page === "" ? `/${lang}` : `/${lang}${page}`
      sitemap.push({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: page === "" || page === "/product" ? "daily" : page === "/blog" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : page === "/product" ? 0.9 : 0.7,
        alternates: {
          languages: {
            uz: `${BASE_URL}/uz${page}`,
            ru: `${BASE_URL}/ru${page}`,
            en: `${BASE_URL}/en${page}`,
            "x-default": `${BASE_URL}/uz${page}`,
          },
        },
      })
    })

    // Har bir til uchun product pages
    products.forEach(product => {
      sitemap.push({
        url: `${BASE_URL}/${lang}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            uz: `${BASE_URL}/uz/product/${product.id}`,
            ru: `${BASE_URL}/ru/product/${product.id}`,
            en: `${BASE_URL}/en/product/${product.id}`,
            "x-default": `${BASE_URL}/uz/product/${product.id}`,
          },
        },
      })
    })

    // Har bir til uchun blog pages
    blogs.forEach(blog => {
      sitemap.push({
        url: `${BASE_URL}/${lang}/blog/${blog.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            uz: `${BASE_URL}/uz/blog/${blog.id}`,
            ru: `${BASE_URL}/ru/blog/${blog.id}`,
            en: `${BASE_URL}/en/blog/${blog.id}`,
            "x-default": `${BASE_URL}/uz/blog/${blog.id}`,
          },
        },
      })
    })
  })

  return sitemap
}
