import { useMutation } from "@tanstack/react-query";

type FormDataType = {
  name: string;
  phone: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

const sendToBitrix = async (formData: FormDataType) => {
  const response = await fetch("/api/sendToBitrix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Bitrixga yuborishda xatolik");
  }

  return resData;
};

export const useBitrixMutation = () =>
  useMutation({
    mutationFn: sendToBitrix,
  });
