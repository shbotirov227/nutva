import { useMutation } from "@tanstack/react-query";

type BitrixFormData = {
  name: string;
  phone: string;
  comment?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export function useContactBitrixMutation() {
  return useMutation({
    mutationFn: async (formData: BitrixFormData) => {
      const response = await fetch("/api/sendToContactBitrix", {
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
