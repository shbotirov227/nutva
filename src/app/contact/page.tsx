"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const { mutate: submitContact, isPending } = useMutation({
    mutationFn: async () => {
      return apiClient.postContactForm({ name, phone, comment });
    },
    onSuccess: () => {
      toast.success(t("form.applicationSuccess") || "Yuborildi", {
        position: "top-center",
        autoClose: 1200,
      });
      setName("");
      setPhone("");
      setComment("");
    },
    onError: () => {
      toast.error(t("errors.badRequest") || "Xatolik yuz berdi", {
        position: "top-center",
        autoClose: 1200,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    submitContact();
  };

  return (
    <section className="bg-[#BEE1B5] py-32 px-4">
      <div className="max-w-5xl mx-auto text-center mb-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A3929] mb-4">{t("contact.title")}</h2>
        <p className="text-[#1A3929] text-base md:text-lg">
          {t("contact.subtitle")}
        </p>
      </div>

      <Card className="max-w-2xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FDF6F2] rounded-xl">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              name="name"
              placeholder={t("form.input.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white w-full"
            />
            <Input
              name="phone"
              placeholder={t("form.input.phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-white w-full"
            />
          </div>

          <Textarea
            name="message"
            placeholder={t("form.input.message")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-white resize-none w-full"
          />

          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#267A41] hover:bg-[#1F6335] text-white w-full md:w-auto"
          >
            {loading ? t("common.loading") : t("button.sendMessage")}
          </Button>
        </form>

        <div className="text-left space-y-4 text-[#1A3929]">
          <div>
            <p className="font-semibold mb-1 text-[#164A24]">📞 {t("form.input.phone")}:</p>
            <p className="text-sm font-light text-[#164A24]">+998 71 211-11-12</p>
            <p className="mt-2 text-sm text-[#164A24]">1294 ({t("form.shortNumber")})</p>
          </div>
          <div>
            <p className="font-semibold mb-1 text-[#164A24]">📧 {t("form.email")}:</p>
            <p className="text-sm text-[#164A24]">info@nutva.uz</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
