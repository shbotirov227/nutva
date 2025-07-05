"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormInputWrapper } from "./FormInputWrapper";
import PhoneField from "./PhoneField";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type ContactFormModalProps = {
  children: React.ReactElement<React.HTMLAttributes<HTMLButtonElement>>;
  onSuccess?: () => void;
  btnColor?: string;
};

export default function ContactFormModal({ children, onSuccess, btnColor }: ContactFormModalProps) {
  const { t } = useTranslation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [errors, setErrors] = React.useState<{ name?: string; phone?: string }>({});

  React.useEffect(() => setIsMounted(true), []);

  React.useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < 200 && spaceAbove > 200);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { mutate: submitContact, isPending } = useMutation({
    mutationFn: async () => {
      return apiClient.postContactForm({ name, phone, comment: "" });
    },
    onSuccess: () => {
      toast.success(t("form.applicationSuccess") || "Yuborildi", {
        position: "top-center",
        autoClose: 1200,
      });
      setIsOpen(false);
      setName("");
      setPhone("");
      onSuccess?.();
    },
    onError: () => {
      toast.error(t("errors.badRequest") || "Xatolik yuz berdi", {
        position: "top-center",
        autoClose: 1200,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || !phone) {
      toast.error(t("form.fillAllFields") || "Iltimos, barcha maydonlarni to'ldiring", {
        position: "top-center",
        autoClose: 1200,
      });
      return;
    }

    submitContact();
  };

  const trigger = React.cloneElement(children, {
    onClick: () => setIsOpen(true),
  });

  const inputStyle =
    "!w-full !border-gray-800 sm:px-5 sm:py-3 rounded-xl text-gray-800 text-[15px] font-bold bg-white outline-none !border-2 focus:!shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all";

  if (!isMounted) return null;

  return (
    <>
      {trigger}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-black rounded-2xl w-full max-w-md mx-auto p-6 sm:p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-center text-xl font-bold mb-4">
                {t("contactModal.title") || "Aloqa uchun"}
              </h2>
              <p className="text-center mb-6 text-base text-gray-600">
                {t("contactModal.subtitle") ||
                  "Ismingiz va telefon raqamingiz hamda quyidagi ma'lumotlarni qoldiring - mutaxassislarimiz siz bilan bog'lanadi!"}
              </p>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <FormInputWrapper error={errors.name}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("form.input.name")}
                    className={inputStyle}
                  />
                </FormInputWrapper>

                <FormInputWrapper error={errors.phone}>
                  <PhoneField
                    placeholder={t("form.input.phone")}
                    phone={phone}
                    setPhone={setPhone}
                    setErrors={setErrors}
                    className={inputStyle}
                    containerRef={containerRef}
                    dropdownStyle={{
                      top: dropUp ? "auto" : undefined,
                      bottom: dropUp ? "100%" : undefined,
                      transform: dropUp ? "translateY(-5px)" : "translateY(0)",
                    }}
                  />
                </FormInputWrapper>

                <div className="flex flex-row justify-between gap-3 mt-2">
                  <Button
                    type="button"
                    size={"lg"}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-6 bg-gray-100 hover:bg-gray-800 text-gray-800 hover:text-white border border-gray-800 box-border rounded-lg cursor-pointer"
                  >
                    {t("button.cancelButton")}
                  </Button>

                  <Button
                    type="submit"
                    size={"lg"}
                    disabled={isPending}
                    style={{ backgroundColor: btnColor || "#218A4F" }}
                    className="flex-1 py-[26px] text-white rounded-lg cursor-pointer hover:!bg-[#1F6335]"
                  >
                    {isPending ? t("common.loading") : t("button.formButton")}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
