import { NextResponse } from "next/server"

// Eski sitemap.xml ga kirayotgan so'rovlarni yangi dynamic sitemap.xml ga yo'naltirish
export async function GET() {
  return NextResponse.redirect("https://nutva.uz/sitemap.xml", 301)
}
