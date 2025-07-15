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
  },
};

export default nextConfig;
