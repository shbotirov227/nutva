import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// domains: ["http://nutva-11a7ac0c0873.herokuapp.com/uploads"],

	images: {
		// domains: ["nutva-11a7ac0c0873.herokuapp.com", "www.nutvahealth.uz"],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "nutva-11a7ac0c0873.herokuapp.com",
				port: "",
				pathname: "/uploads/**",
			},
			{
				protocol: "http",
				hostname: "www.nutvahealth.uz",
				port: "",
				pathname: "/uploads/**",
			},
		],
		unoptimized: true,
	},

	// experimental: {
	// 	optimizeCss: true,
	// },

	async rewrites() {
		return [
			{
				source: "/api/:path((?!auth).*)",
				destination: "https://www.nutvahealth.uz/api/:path*",
			},
		];
	},
	//   devIndicators: false,
	env: {
		NEXT_PUBLIC_BASE_URL: "https://www.nutvahealth.uz/api",
		NEXT_PUBLIC_API_URL: "https://www.nutvahealth.uz/api",
	},
};

export default nextConfig;
