import axios from "axios";
import { CreateBlogType } from "@/types/blogs/createBlog";
import { GetAllBlogsType } from "@/types/blogs/getAllBlogs";
import { GetOneBlogType } from "@/types/blogs/getOneBlog";
import { CreateProductType } from "@/types/products/createProduct";
import { GetAllProductsType } from "@/types/products/getAllProducts";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { CreateProductPurchaseRequest } from "@/types/purchase/createProductPurchaseRequest";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ dynamic base URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const apiClient = {
  getBanner: async (lang: string) => {
    const res = await api.get("/Banner", { params: { lang } });
    return res.data;
  },

  getAllProducts: async (lang: string) => {
    const res = await api.get<GetAllProductsType>("/Product", { params: { lang } });
    return res.data;
  },

  getOneProduct: async (id: string) => {
    const res = await api.get<GetOneProductType>(`/Product/${id}`);
    return res.data;
  },

  getOneProductById: async (id: string, lang: string) => {
    const res = await api.get<GetOneProductType>(`/Product/${id}`, {
      params: { lang }
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
    const res = await api.post("/Product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  getAllBlogs: async (lang: string) => {
    const res = await api.get<GetAllBlogsType>("/BlogPost", {
      params: { lang }
    });
    return res.data;
  },

  getOneBlog: async (id: string, lang: string) => {
    const res = await api.get<GetOneBlogType>(`/BlogPost/${id}`, {
      params: { lang }
    });
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

  postPurchaseRequest: async (data: CreateProductPurchaseRequest) => {
    const res = await api.post(`/statistics/purchase-request`, data);
    return res.data;
  },

  getTrackingPixels: async () => {
    const res = await api.get("/pixels");
    return res.data;
  },

  postContactForm: async (data: { name: string; phone: string; comment: string }) => {
    const res = await api.post("/contact-forms", data);
    return res.data;
  },
};
