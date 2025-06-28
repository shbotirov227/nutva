/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormInputWrapper } from "./FormInputWrapper";
import PhoneField from "./PhoneField";
// import { useBitrixMutation } from "@/hooks/useBitrixMutation";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
// import { useLang } from "@/context/LangContext";

type FormModalProps = {
  productId?: string;
  children: React.ReactElement<React.HTMLAttributes<HTMLButtonElement>>;
  onClose?: () => void;
  onSuccess?: () => void;
  quantity: number;
  btnColor?: string;
};

export function FormModal({ productId, children, quantity, btnColor }: FormModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  // const [countryCode] = React.useState("+998");
  const [errors, setErrors] = React.useState<{ name?: string; phone?: string }>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = React.useState(false);
  // const { lang } = useLang();
  const { t } = useTranslation();

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


  // const { mutate: sendToBitrix, isPending } = useBitrixMutation();

  const { mutate: purchaseProduct, isPending } = useMutation({
    mutationFn: (data: {
      productId: string;
      buyerName: string;
      phone: string;
      comment: string;
    }) => apiClient.postPurchaseRequest(data),
    onSuccess: () => {
      toast.success(t("form.success") || "So'rov yuborildi");
      setIsOpen(false);
      setName("");
      setPhone("");
    },
    onError: (err: any) => {
      toast.error(err.message || t("errors.badRequest") || "Xatolik yuz berdi");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    // const digitsOnly = phone.replace(/\D/g, "");
    // const cleanedCode = countryCode.replace(/\D/g, "");
    // const phoneLength = digitsOnly.length - cleanedCode.length;

    if (!trimmedName ) {
      toast.error(t("form.fillAllFields") || "Barcha maydonlarni to'ldiring");
      return;
    }

    // const searchParams = new URLSearchParams(window.location.search);
    // const formData = {
    //   name: trimmedName,
    //   phone,
    //   productName,
    //   quantity,  
    //   utm_source: searchParams.get("utm_source") || undefined,
    //   utm_medium: searchParams.get("utm_medium") || undefined,
    //   utm_campaign: searchParams.get("utm_campaign") || undefined,
    //   utm_term: searchParams.get("utm_term") || undefined,
    //   utm_content: searchParams.get("utm_content") || undefined,
    // };

    // sendToBitrix(formData, {
    //   onSuccess: () => {
    //     toast.success(t("form.success") || "So'rov yuborildi");
    //     setIsOpen(false);
    //   },
    //   onError: (err: any) => {
    //     toast.error(err.message || t("errors.badRequest") || "Xatolik yuz berdi");
    //   },
    // });
    purchaseProduct({
      productId: productId || "",
      buyerName: trimmedName,
      phone: phone,
      comment: `${quantity}`,
    });
  };


  const trigger = React.cloneElement(children, {
    onClick: () => setIsOpen(true),
  });

  
  const inputSharedStyle = "!w-full !px-10 !py-6 !border-gray-800 sm:px-5 sm:py-3 rounded-xl text-gray-800 text-[15px] font-bold bg-white outline-none border- focus:!shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all";
  
  if (!isMounted) return null;

  return (
    <>
      {trigger}

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 !z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="!z-50 bg-white text-black rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-xl mx-auto p-6 sm:p-8 md:p-10 border-none"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h2 className="text-center text-xl sm:text-2xl text-black font-bold">
                  {t("formModal.title")}
                </h2>
                <p className="text-center text-sm sm:text-base text-black font-semibold mt-2">
                  {t("formModal.subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <FormInputWrapper
                  error={errors.name}
                  className="flex flex-col gap-1"
                >
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("form.input.name")}
                    className="w-full px-4 py-4 sm:px-5 sm:py-3 rounded-xl text-[15px] font-bold bg-white outline-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all"
                  />
                </FormInputWrapper>

                <FormInputWrapper
                  error={errors.phone}
                  className="flex w-full flex-col gap-1 border-[#218A4F]"
                >
                  <PhoneField
                    placeholder={t("form.input.phone")}
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
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-4 sm:py-5 bg-gray-100 hover:bg-gray-800 text-gray-800 hover:text-white border border-gray-800 rounded-lg cursor-pointer"
                  >
                    {t("button.cancelButton")}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    style={{ backgroundColor: btnColor ? btnColor : "#218A4F" }}
                    className="flex-1 py-4 sm:py-5 bg-green-600 hover:bg-green-700 transition-all text-white rounded-lg cursor-pointer"
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
