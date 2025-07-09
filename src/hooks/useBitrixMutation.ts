import { useMutation } from "@tanstack/react-query";

type BitrixProduct = {
  productId: string;
  quantity: number;
  total?: number;
};

type BitrixFormData = {
  buyerName: string;
  phone: string;
  // age: number;
  // forWhom: string;
  // problem: string;
  region: string;
  comment?: string;
  products?: BitrixProduct[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export function useBitrixMutation() {
  return useMutation({
    mutationFn: async (formData: BitrixFormData) => {
      const response = await fetch("/api/sendToBitrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (!response.ok || !res.success) {
        throw new Error(res.message || "Bitrixga yuborishda xatolik");
      }

      return res;
    },
  });
}
