import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormInputWrapper } from "./FormInputWrapper";
import PhoneField from "./PhoneField";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { CreateProductPurchaseRequest } from "@/types/purchase/createProductPurchaseRequest";
// import { getPurchaseProductsPayload } from "@/helper/getPurchaseProductsPayload";
import { useCart } from "@/context/CartContext";
import { getPurchaseProductsPayload } from "@/helper/getPurchaseProductsPayload";
import { useBitrixMutation } from "@/hooks/useBitrixMutation";

type FormModalProps = {
  products?: { productId: string; quantity: number }[];
  children: React.ReactElement<React.HTMLAttributes<HTMLButtonElement>>;
  onClose?: () => void;
  onSuccess?: () => void;
  btnColor?: string;
};

export function FormModal({ children, products, btnColor }: FormModalProps) {

  const { t } = useTranslation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  // const [age, setAge] = React.useState("");
  // const [forWhom, setForWhom] = React.useState("");
  // const [problem, setProblem] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [errors, setErrors] = React.useState<{
    name?: string;
    phone?: string;
    // age?: string;
    // forWhom?: string;
    // problem?: string;
    region?: string;
    comment?: string;
    // productName?: string;
  }>({});
  const { cart, removeAll } = useCart();

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

  const { mutate: sendToBitrix, isPending } = useBitrixMutation();

  const { mutate: purchaseProduct } = useMutation({
    mutationFn: (data: CreateProductPurchaseRequest) => apiClient.postPurchaseRequest(data),
    onSuccess: () => {
      toast.success(t("form.success") || "So'rov yuborildi", {
        position: "top-center",
        autoClose: 1200,
      });
      setIsOpen(false);
      setName("");
      setPhone("");
      // setAge("");
      // setForWhom("");
      // setProblem("");
      setRegion("");
      setComment("");
      removeAll();
    },
    onError: () => {
      toast.error("Xatolik yuz berdi", {
        position: "top-center",
        autoClose: 1200,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    // const digitsOnly = phone.replace(/\D/g, "");
    // const cleanedCode = countryCode.replace(/\D/g, "");
    // const phoneLength = digitsOnly.length - cleanedCode.length;

    // const numericAge = Number(age);

    // if (!numericAge || numericAge < 1 || numericAge > 120) {
    //   toast.error(t("errors.ageError") || "Iltimos, haqiqiy yosh kiriting (1-120)", {
    //     position: "top-center",
    //     autoClose: 1200,
    //   });
    //   return;
    // }

    if (
      !trimmedName ||
      !phone ||
      // !age ||
      // !forWhom ||
      // !problem ||
      !region
      // numericAge < 1 ||
      // numericAge > 120
    ) {
      toast.error(t("form.fillAllFields") || "Barcha maydonlarni to'ldiring", {
        position: "top-center",
        autoClose: 1200,
      });
      return;
    }


    const searchParams = new URLSearchParams(window.location.search);
    const formData = {
      buyerName: trimmedName,
      // age: numericAge,
      // forWhom: forWhom,
      // problem: problem,
      region: region,
      phone: phone,
      comment: comment,
      products: products || getPurchaseProductsPayload(cart),
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    };

    sendToBitrix(formData, {
      onSuccess: () => {
        toast.success(t("form.success") || "So'rov yuborildi", {
          position: "top-center",
          autoClose: 1200,
        });
        setIsOpen(false);
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
    purchaseProduct({
      buyerName: trimmedName,
      // age: numericAge,
      // forWhom: forWhom,
      // problem: problem,
      region: region,
      phone: phone,
      comment: comment,
      products: products || getPurchaseProductsPayload(cart)

    });
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
                  <div className="gap-5 grid grid-cols-1">
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

                    {/* <FormInputWrapper
                      error={errors.age}
                      className="flex flex-col gap-1"
                    >
                      <input
                        id="age"
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={age}
                        // onChange={(e) => setAge(e.target.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d{0,3}$/.test(val)) setAge(val);
                        }}
                        placeholder={t("form.input.age")}
                        className="w-full px-4 py-4 sm:px-5 sm:py-3 rounded-xl text-[15px] font-bold bg-white outline-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all"
                      />
                    </FormInputWrapper> */}

                    {/* <FormInputWrapper
                      error={errors.forWhom}
                      className="flex flex-col gap-1"
                    >
                      <input
                        id="forWhom"
                        type="text"
                        value={forWhom}
                        onChange={(e) => setForWhom(e.target.value)}
                        placeholder={t("form.input.forWhom")}
                        className="w-full px-4 py-4 sm:px-5 sm:py-3 rounded-xl text-[15px] font-bold bg-white outline-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all"
                      />
                    </FormInputWrapper> */}

                    {/* <FormInputWrapper
                      error={errors.problem}
                      className="flex flex-col gap-1"
                    >
                      <input
                        id="problem"
                        type="text"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder={t("form.input.problem")}
                        className="w-full px-4 py-4 sm:px-5 sm:py-3 rounded-xl text-[15px] font-bold bg-white outline-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all"
                      />
                    </FormInputWrapper> */}
                  </div>

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

                  <FormInputWrapper
                    error={errors.region}
                    className="flex flex-col gap-1"
                  >
                    <input
                      id="region"
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder={t("form.input.region")}
                      className="w-full px-4 py-4 sm:px-5 sm:py-3 rounded-xl text-[15px] font-bold bg-white outline-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all"
                    />
                  </FormInputWrapper>

                  <FormInputWrapper
                    error={errors.comment}
                    className="flex flex-col gap-1"
                  >
                    <textarea
                      id="comment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t("form.input.comment")}
                      className="w-full px-4 py-4 sm:px-5 sm:py-3 rounded-xl text-[15px] font-bold bg-white outline-none ring-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all"
                    ></textarea>
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
        </AnimatePresence>,
       document.body 
      )}
    </>
  );
}
