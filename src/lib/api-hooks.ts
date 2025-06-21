// // lib/api-hooks.ts
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiClient } from "./apiClient";
// import { useSession } from "next-auth/react";
// import { GetOneProductType } from "@/types/products/getOneProduct";
// import { GetAllProductsType } from "@/types/products/getAllProducts";
// import { CreateProductType } from "@/types/products/createProduct";
// import { GetAllBlogsType } from "@/types/blogs/getAllBlogs";
// import { GetOneBlogType } from "@/types/blogs/getOneBlog";
// import { CreateBlogType } from "@/types/blogs/createBlog";

// // 🔁 Common headers with token
// const useAuthHeaders = () => {
//   const { data: session } = useSession();
//   return {
//     Authorization: `Bearer ${session?.user?.token}`,
//   };
// };

// // 🟩 BLOG HOOKLAR

// export const useGetAllBlogs = () => {
//   const headers = useAuthHeaders();
//   return useQuery({
//     queryKey: ["blogs"],
//     queryFn: async () => {
//       const res = await apiClient.get<GetAllBlogsType>("/Blog", { headers });
//       return res.data;
//     },
//   });
// };

// export const useGetOneBlog = (id: string) => {
//   const headers = useAuthHeaders();
//   return useQuery({
//     queryKey: ["blog", id],
//     queryFn: async () => {
//       const res = await apiClient.get<GetOneBlogType>(`/Blog/${id}`, {
//         headers,
//       });
//       return res.data;
//     },
//     enabled: !!id,
//   });
// };

// export const useCreateBlog = () => {
//   const headers = useAuthHeaders();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: CreateBlogType) => {
//       const res = await apiClient.post("/api/Blog", data, { headers });
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["blogs"] });
//     },
//   });
// };

// // ⛔️ Boshqalar: updateBlog, deleteBlog — xuddi shunday yoziladi

// // 🟨 PRODUCT HOOKLAR

// export const useGetAllProducts = () => {
//   const headers = useAuthHeaders();
//   return useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await apiClient.getAllProducts("/Product", {
//         headers,
//       });
//       return res.data;
//     },
//   });
// };

// export const useGetOneProduct = (id: string) => {
//   const headers = useAuthHeaders();
//   return useQuery({
//     queryKey: ["product", id],
//     queryFn: async () => {
//       const res = await apiClient.get<GetOneProductType>(`/Product/${id}`, {
//         headers,
//       });
//       return res.data;
//     },
//     enabled: !!id,
//   });
// };

// export const useCreateProduct = () => {
//   const headers = useAuthHeaders();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: CreateProductType) => {
//       const res = await apiClient.post("/Product", data, { headers });
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });
// };
