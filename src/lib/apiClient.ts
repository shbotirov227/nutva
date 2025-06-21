// import axios from "axios";

// export const apiClient = axios.create({
// 	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// 	headers: {
// 		"Content-Type": "application/json",
// 		"Accept": "application/json",
// 		"Access-Control-Allow-Origin": "*"

// 	},
// 	withCredentials: true,
// });

// console.log("API Client Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

// const {data: session} = await fetch("/api/auth/session").then(res => res.json());

// apiClient.interceptors.request.use((config) => {
// 	if (typeof window !== "undefined") {
// 		const token = session?.user?.token;
//         console.log("Token:", token);
//         console.log("Session:", session);
// 		if (token) config.headers.Authorization = `Bearer ${token}`;
// 	}
// 	return config;
// });


// lib/apiClient.ts
import { CreateBlogType } from "@/types/blogs/createBlog";
import { CreateProductType } from "@/types/products/createProduct";
import { GetAllProductsType } from "@/types/products/getAllProducts";
import axios from "axios";
// import { getToken } from "next-auth/jwt";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// api.interceptors.request.use(async (config) => {
// 	const token = await getToken({ req: config.url, raw: true });
// 	if (token) {
// 		config.headers.Authorization = `Bearer ${token}`;
// 	}
// 	return config;
// });

// Exported API functions
export const apiClient = {
  getAllProducts: async (lng: string) => {
    // const session = await getSession();
    // const token = session?.user?.token;

    const res = await api.get("/Product", {
      // headers: token ? { Authorization: `Bearer ${token}` } : {},
      params: {
        lang: lng,
      }
    });
    return res.data;
  },
  getOneProduct: async (id: string) => {
    const res = await api.get<GetAllProductsType>(`/Product/${id}`);
    return res.data;
  },
  createProduct: async (data: CreateProductType, token: string) => {
    const res = await fetch("/Product", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getAllBlogs: async (lng: string) => {
    const res = await api.get("/BlogPost", {
      params: {
        lang: lng
      }
    });
    return res.data;
  },
  getOneBlog: async (id: string) => {
    const res = await api.get(`/BlogPost/${id}`);
    return res.data;
  },
  createBlog: async (data: CreateBlogType) => {
    const res = await api.post("/BlogPost", data);
    return res.data;
  },
};
