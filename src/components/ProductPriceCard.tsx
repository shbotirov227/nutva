"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { useTranslation } from "react-i18next";
import { useLocalizedProduct } from "@/hooks/useLocalizedProduct";
import { formatPrice } from "@/lib/formatPrice";
import { Flame, Minus, Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { FormModal } from "./FormModal";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { useDiscount } from "@/hooks/useDiscount";
// import SuccessModal from "./SuccessModal";

interface Props {
  product: GetOneProductType;
  bgColor: string | undefined;
  color: string | undefined;
  onClick?: () => void;
}

const quantityOptions = [1, 2, 3];

const DISCOUNT_TABLE: Record<string, { two: number; threePlus: number }> = {
  VIRIS: { two: 16.7, threePlus: 27.8 },
  FERTILIA: { two: 16.7, threePlus: 27.8 },
  GELMIN: { two: 20, threePlus: 34 },
  COMPLEX: { two: 22.7, threePlus: 36.4 },
  EXTRA: { two: 22.7, threePlus: 36.4 },
};

export default function ProductPriceCard({ product, bgColor, color, onClick }: Props) {
  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showFormModal, setShowFormModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(4);
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();
  const { lang } = useLang();

  useEffect(() => {
    setMounted(true);
  }, []);

  // const handleSuccess = () => {
  //   setShowFormModal(false);
  //   setShowSuccessModal(true);
  // };

  const localizedProduct = useLocalizedProduct(product, lang);
  // const productKey = product?.slug?.toUpperCase();

  const selectedQuantity = isChecked ? count! : quantity!;

  const { pricePerUnit, totalPrice, discountPercent } = useDiscount(product?.uz?.name, selectedQuantity);
  console.log({ pricePerUnit })


  const handleClick = () => {
    // setShowFormModal(true);
    if (onClick) {
      onClick();
      toast.success("Product buyed!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // const handleCheckboxChange = () => {
  //   const newChecked = !isChecked;
  //   setIsChecked(newChecked);

  //   if (newChecked) {
  //     setCount(quantity);
  //   } else {
  //     setQuantity(count);
  //   }
  // };


  if (!product || !localizedProduct || !mounted) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full rounded-xl flex flex-col gap-4"
      >
        <Card
          style={{ backgroundColor: bgColor, borderColor: color }}
          className="rounded-2xl p-6 w-full text-black shadow-[0_10px_20px_rgba(0,0,0,0.6)] border-1"
        >
          <CardContent className="p-0">
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full rounded-xl flex flex-col gap-4"
              >
                <div className="mb-4">
                  <h2 className="text-4xl font-bold">{localizedProduct?.name}</h2>
                  <p className="text-xl mt-1 text-gray-800">{product?.slug}</p>
                </div>

                {discountPercent > 0 && (
                  <div className="flex gap-2 items-center mb-4">
                    <Badge className="bg-yellow-400 text-black text-base font-semibold px-2 py-1 rounded-full">
                      -{discountPercent}%
                    </Badge>
                    <Badge className="bg-yellow-400 text-black text-base font-semibold px-2 py-1 rounded-full">
                      {t("common.saleUpperCase")}
                    </Badge>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div style={{ backgroundColor: bgColor }} className="rounded-xl p-4 mb-4">
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl flex flex-col gap-4"
                >
                  {discountPercent > 0 && (
                    <div className="flex items-center text-base font-semibold text-red-600 gap-1 mb-4 bg-white p-4 rounded-lg">
                      <Flame className="w-4 h-4" />
                      {t("common.forYou")} {discountPercent}% {t("common.sale")} • {quantity} {t("common.quantity")}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl flex flex-col gap-4"
                >
                  <div className="flex justify-between bg-white rounded-lg p-4">
                    {quantityOptions.map((q) => (
                      <AnimatePresence mode="popLayout" key={q}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full rounded-xl flex flex-col gap-4"
                        >
                          <Button
                            variant="ghost"
                            onClick={() => {
                              if (!isChecked) setQuantity(q);
                            }}
                            onMouseEnter={(e) => {
                              if (!isChecked) {
                                e.currentTarget.style.backgroundColor = color || "transparent";
                                e.currentTarget.style.color = "white";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isChecked && quantity !== q) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#1f2937";
                              }
                            }}
                            style={{
                              backgroundColor: !isChecked && quantity === q ? color : "transparent",
                              color: !isChecked && quantity === q ? "white" : "#1f2937",
                              pointerEvents: isChecked ? "none" : "auto",
                              opacity: isChecked ? 0.4 : 1
                            }}
                            className="flex-1 text-sm mx-1 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm  border-1"
                          >
                            {q} {t("common.quantity")}
                          </Button>
                        </motion.div>
                      </AnimatePresence>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3 mt-4">
                    <Checkbox
                      id="quantityCheck"
                      checked={isChecked}
                      onCheckedChange={(e) => setIsChecked(e.valueOf().toString().toLowerCase() === "true")}
                      className="w-6 h-6 bg-white cursor-pointer"
                      style={{ backgroundColor: isChecked ? color : "white" }}
                    />
                    <Label htmlFor="quantityCheck" className="cursor-pointer text-base">{t("product.checkboxLabel")}</Label>
                  </div>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl flex flex-col gap-4"
                >
                  {isChecked && (
                    <div className="flex items-center justify-center mt-4 bg-white py-3 rounded-lg">
                      <Button
                        size={"sm"}
                        style={{ backgroundColor: color }}
                        className="cursor-pointer text-base flex items-center justify-center text-center"
                        onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
                      >
                        <Minus />
                      </Button>

                      <p className="mx-5 font-bold text-2xl">{count}</p>

                      <Button
                        size={"sm"}
                        style={{ backgroundColor: color }}
                        className="cursor-pointer text-base flex items-center justify-center text-center"
                        onClick={() => setCount((prev) => prev + 1)}
                      >
                        <Plus />
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>

            <div style={{ color: color }} className="text-3xl font-bold mb-4">
              {formatPrice(totalPrice)} {t("common.sum", "so'm")}
            </div>

            <FormModal
              // onClose={() => setShowFormModal(false)}
              // onSuccess={handleSuccess}
              // productName={localizedProduct?.name}
              quantity={selectedQuantity}
              btnColor={color}
              productId={product?.id}
            >
              <Button
                size={"lg"}
                onClick={handleClick}
                style={{ backgroundColor: color, padding: "1.6rem" }}
                className={cn(
                  bgColor ? `bg-${bgColor}` : null,
                  "w-full text-white text-lg font-semibold rounded-lg cursor-pointer transition-all"
                )}
              >
                {t("common.buy")}
              </Button>
            </FormModal>

            {/* {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )} */}

          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
