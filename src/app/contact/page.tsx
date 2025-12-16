"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PhoneField from "@/components/PhoneField";
import { cn } from "@/lib/utils";
import { BitrixFormData, useContactBitrixMutation } from "@/hooks/useContactBitrixMutation";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  const { t } = useTranslation();

  const { mutate: sendToContactBitrix } = useContactBitrixMutation();
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

    const searchParams = new URLSearchParams(window.location.search);
    const formData: BitrixFormData = {
      name: name,
      phone,
      comment: comment || "",
      source: "contact",
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    };
    sendToContactBitrix(formData, {
      onSuccess: () => {
        toast.success(t("form.success") || "So'rov yuborildi", {
          position: "top-center",
          autoClose: 1200,
        });
      },
      onError: (err: unknown) => {
        const message =
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message
            : undefined;
        console.log(message || t("errors.badRequest") || "Xatolik yuz berdi");
      },
    });

    try {
      submitContact();
      sendToContactBitrix(formData, {
        // 2. Bitrix form submission
        onSuccess: () => {
          toast.success(t("form.success") || "So'rov yuborildi", {
            position: "top-center",
            autoClose: 1200,
          });
          setName("");
          setPhone("");
          setComment("");
        },
        onError: (err: unknown) => {
          const message =
            typeof err === "object" && err !== null && "message" in err
              ? (err as { message?: string }).message
              : undefined;
          console.log(message || t("errors.badRequest") || "Xatolik yuz berdi");
        },
      });
    } catch (err) {
      console.log(t("errors.badRequest") || "Xatolik yuz berdi" || err);
    }

    // submitContact();
  };

  const inputStyle =
    "!w-full !border-gray-800 px-3 py-2 sm:px-5 sm:py-3 rounded-xl text-gray-800 text-[15px] font-bold bg-white outline-none !border-2 focus:!shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all";

  return (
    <section className="bg-[#BEE1B5] py-32 px-4">
      <div className="max-w-5xl mx-auto text-center mb-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A3929] mb-4">{t("contact.title")}</h2>
        <p className="text-[#1A3929] text-base md:text-lg">
          {t("contact.subtitle")}
        </p>
      </div>

      <Card className="max-w-5xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FDF6F2] rounded-xl">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              name="name"
              placeholder={t("form.input.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputStyle}
            />
            {/* <Input
              name="phone"
              placeholder={t("form.input.phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-white w-full"
            /> */}

            <PhoneField
              placeholder={t("form.input.phone")}
              phone={phone}
              setPhone={setPhone}
              className={inputStyle}
            />
          </div>

          <textarea
            name="message"
            placeholder={t("form.input.message")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={cn("bg-white resize-none w-full", inputStyle)}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#267A41] hover:bg-[#1F6335] text-white w-full md:w-auto cursor-pointer"
          >
            {isPending ? t("common.loading") : t("button.sendMessage")}
          </Button>
        </form>

        <div className="text-left space-y-4 text-[#1A3929]">
          <div>
            <p className="font-semibold mb-1 text-[#164A24]">📞 {t("form.input.phone")}:</p>
            <Link
              href="tel:+998712111112"
              className="text-sm text-[#164A24]"
              onClick={(e) => {
                try {
                  if (typeof window !== 'undefined' && typeof window.gtagSendEvent === 'function') {
                    e.preventDefault();
                    window.gtagSendEvent('tel:+998712111112');
                  }
                } catch {}
              }}
            >
              +998 71 211-11-12
            </Link>
            <p className="mt-2 text-sm text-[#164A24]">
              <Link
                href="tel:1294"
                onClick={(e) => {
                  try {
                    if (typeof window !== 'undefined' && typeof window.gtagSendEvent === 'function') {
                      e.preventDefault();
                      window.gtagSendEvent('tel:1294');
                    }
                  } catch {}
                }}
              >
                1294 {" "}
              </Link>
              ({t("form.shortNumber")})
            </p>
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
