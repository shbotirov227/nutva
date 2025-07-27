import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nutva.uz",
        port: "",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nutva.uz/api/:path*",
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
