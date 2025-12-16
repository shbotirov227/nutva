"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormInputWrapper } from "./FormInputWrapper";
import PhoneField from "./PhoneField";
import { useContactBitrixMutation } from "@/hooks/useContactBitrixMutation";

type ContactPopupFormProps = {
  children: React.ReactElement<React.HTMLAttributes<HTMLButtonElement>>;
  onClose?: () => void;
  onSuccess?: () => void;
};

export function ContactPopupForm({ children, onClose, onSuccess }: ContactPopupFormProps) {
  const { t } = useTranslation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [errors, setErrors] = React.useState<{
    name?: string;
    phone?: string;
  }>({});

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const { mutate: sendToContactBitrix, isPending } = useContactBitrixMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || !phone) {
      toast.error(t("form.fillAllFields") || "Barcha maydonlarni to'ldiring", {
        position: "top-center",
        autoClose: 1200,
      });
      return;
    }

    const formData = {
      name: trimmedName,
      phone: phone,
    };

    sendToContactBitrix(formData, {
      onSuccess: () => {
        toast.success(t("form.success") || "So'rov yuborildi", {
          position: "top-center",
          autoClose: 1200,
        });
        setIsOpen(false);
        setName("");
        setPhone("");
        if (onSuccess) onSuccess();
      },
      onError: (err: unknown) => {
        const message =
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message
            : undefined;
        toast.error(message || t("errors.badRequest") || "Xatolik yuz berdi", {
          position: "top-center",
          autoClose: 1200,
        });
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const trigger = React.cloneElement(children, {
    onClick: () => setIsOpen(true),
  });

  const inputSharedStyle = "!w-full !px-10 !py-6 !border-gray-800 sm:px-5 sm:py-3 rounded-xl text-gray-800 text-[15px] font-bold bg-white outline-none !border-2 focus:!shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all";

  if (!isMounted) return null;

  return (
    <>
      {trigger}

      {isMounted && createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              className="fixed inset-0 !z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="!z-50 bg-white text-black rounded-2xl w-full max-w-md sm:max-w-lg mx-auto p-6 sm:p-8 md:p-10 border-none"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h2 className="text-center text-xl sm:text-2xl text-black font-bold">
                    {t("contactPopup.title") || "Bog'lanish"}
                  </h2>
                  <p className="text-center text-sm sm:text-base text-black font-semibold mt-2">
                    {t("contactPopup.subtitle") || "Ism va telefon raqamingizni qoldiring"}
                  </p>
                </div>

                <form id="contact-popup-form" onSubmit={handleSubmit} className="grid gap-4">
                  <FormInputWrapper
                    error={errors.name}
                    className="flex flex-col gap-1"
                  >
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("form.input.name") || "Ismingiz"}
                      className="w-full px-4 py-4 sm:px-5 sm:py-3 rounded-xl text-[15px] font-bold bg-white outline-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all"
                    />
                  </FormInputWrapper>

                  <FormInputWrapper
                    error={errors.phone}
                    className="flex w-full flex-col gap-1 border-[#218A4F]"
                  >
                    <PhoneField
                      placeholder={t("form.input.phone") || "Telefon raqamingiz"}
                      phone={phone}
                      setPhone={setPhone}
                      setErrors={setErrors}
                      className={inputSharedStyle}
                      containerRef={containerRef}
                      dropdownStyle={{
                        top: dropUp ? "auto" : undefined,
                        bottom: dropUp ? "100%" : undefined,
                        transform: dropUp ? "translateY(-5px)" : "translateY(0)",
                      }}
                    />
                  </FormInputWrapper>

                  <div className="flex flex-row items-center justify-between gap-3 mt-2">
                    <Button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-4 sm:py-5 bg-gray-100 hover:bg-gray-800 text-gray-800 hover:text-white border border-gray-800 rounded-lg cursor-pointer"
                    >
                      {t("button.cancelButton") || "Bekor qilish"}
                    </Button>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 py-4 sm:py-5 bg-green-600 hover:bg-green-700 transition-all text-white rounded-lg cursor-pointer"
                    >
                      {isPending ? t("common.loading") || "Yuborilmoqda..." : t("button.submitButton") || "Yuborish"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
