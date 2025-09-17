import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nutva.uz",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "nutva.uz", 
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "www.api.nutvahealth.uz",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.nutvahealth.uz",
        port: "",
        pathname: "/uploads/**",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 86400, // 24 hours
    // Enable optimization for production
    unoptimized: false,
  },

  // Experimental features for performance
  experimental: {
    // typedRoutes: true, // Disabled for Turbopack compatibility
    // optimizeCss: true, // Disabled due to critters dependency issue
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Modern browser target to reduce legacy JavaScript
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  async headers() {
    return [
      {
        // Aggressive caching for Next.js build assets
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache static assets
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      // Removed duplicate static extension rule (replaced by public assets rule above)
      {
        // Cache API responses briefly
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // Locale-prefixed pages rewrite to underlying routes
      { source: "/:lang(uz|ru|en)", destination: "/" },
      { source: "/:lang(uz|ru|en)/:path*", destination: "/:path*" },

      // API proxy
      { source: "/api/:path*", destination: "https://nutva.uz/api/:path*" },
    ];
  },

  async redirects() {
    return [
      // Eski certificate nomini to'g'irlab
      {
        source: "/ceritificates",
        destination: "/certificates",
        permanent: true,
      },
    ];
  },

  env: {
    NEXT_PUBLIC_BASE_URL: "https://nutva.uz/api",
    NEXT_PUBLIC_API_URL: "https://nutva.uz/api",
    NEXT_TELEGRAM_API: "https://nutva.uz/telegram-api",
    NEXT_WEBSOCK_API: "wss://nutva.uz/telegram-api/ws",

    // NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // NEXT_TELEGRAM_API: process.env.NEXT_TELEGRAM_API,
    // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // NEXT_PUBLIC_BITRIX_WEBHOOK: process.env.NEXT_PUBLIC_BITRIX_WEBHOOK,

    // NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // NEXT_TELEGRAM_API: process.env.NEXT_TELEGRAM_API,
    // NEXT_WEBSOCK_API: process.env.NEXT_WEBSOCK_API,
    // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // NEXT_PUBLIC_BITRIX_WEBHOOK: process.env.NEXT_PUBLIC_BITRIX_WEBHOOK,
  },
};

export default nextConfig;
