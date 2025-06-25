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
import { GetAllBlogsType } from "@/types/blogs/getAllBlogs";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import { CreateProductType } from "@/types/products/createProduct";
import { GetAllProductsType } from "@/types/products/getAllProducts";
import { GetOneProductType } from "@/types/products/getOneProduct";
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

  getBanner: async () => {
    const res = await api.get("/Banner");
    return res.data;
  },

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

  getOneProductById: async (id: string, lang: string) => {
    const res = await api.get<GetOneProductType>(`/Product/${id}`, {
      params: {
        lang: lang
      }
    });
    return res.data;
  },

  postProductView: async (id: string) => {
    const res = await api.post(`/Product/view/${id}`);
    return res.data;
  },

  postBuyProduct: async (id: string) => {
    const res = await api.post(`/Product/buy-click/${id}`);
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

  getAllBlogs: async (lang: string) => {
    const res = await api.get<GetAllBlogsType>("/BlogPost", {
      params: {
        lang: lang
      }
    });
    return res.data;
  },
  getOneBlog: async (id: string) => {
    const res = await api.get<GetOneBlogType>(`/BlogPost/${id}`);
    return res.data;
  },

  createBlog: async (data: CreateBlogType) => {
    const res = await api.post("/BlogPost", data);
    return res.data;
  },

  postTrackVisit: async () => {
    const res = await api.post("/statistics/track-visit");
    return res.data;
  },

  getTrackingPixels: async () => {
    const res = await api.get("/pixels");
    return res.data;
  },
};
