"use client";

import React, { useEffect, useState } from "react";
// import { useLang } from "@/context/LangContext";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { useTranslation } from "react-i18next";
import { ProductName } from "@/types/enums";
// import { useLocalizedProduct } from "@/hooks/useLocalizedProduct";
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
import { useCart } from "@/context/CartContext";
// import SuccessModal from "./SuccessModal";

interface Props {
  product: GetOneProductType;
  bgColor: string | undefined;
  color: string | undefined;
  onClick?: () => void;
}

const quantityOptions = [1, 2, 3];

export default function ProductPriceCard({ product, bgColor, color, onClick }: Props) {
  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showFormModal, setShowFormModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(4);
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();
  // const { lang } = useLang();
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // const handleSuccess = () => {
  //   setShowFormModal(false);
  //   setShowSuccessModal(true);
  // };

  // const localizedProduct = useLocalizedProduct(product, lang);
  const selectedQuantity = isChecked ? count! : quantity!;
  const { basePrice, totalPrice, discountPercent } = useDiscount(product?.name, selectedQuantity);


  const handleClick = () => {
    // setShowFormModal(true);
    if (onClick) {
      onClick();
      toast.success("Product buyed!", {
        position: "top-center",
        autoClose: 1200,
      });
    }
  };

  const handleAddToCart = () => {
    if (!product || !product.id) return;

    addToCart({
      ...product,
      quantity: selectedQuantity,
    });
    toast.success(t("product.addedToCart"), {
      position: "top-center",
      autoClose: 1200,
    });
  }

  if (!product || !product || !mounted) return null;

  // Small helper for smooth vertical collapse/expand animations
  const Collapse: React.FC<{ show: boolean; className?: string; children: React.ReactNode }> = ({
    show,
    className,
    children,
  }) => (
    <AnimatePresence initial={false} mode="popLayout">
      {show && (
        <motion.div
          key="collapse"
          layout
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, layout: { duration: 0.25 } }}
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
                transition={{ duration: 0.3, layout: { duration: 0.25 } }}
                className="w-full rounded-xl flex flex-col gap-4"
              >
                <div className="mb-4">
                  <h2 className="text-4xl font-bold">{product?.name}</h2>
                  <p className="text-xl mt-1 text-gray-800">{product?.slug}</p>
                </div>
                <p className="text-xl mt-1 font-semibold" style={{ color }}>
                  {t("product.saleTitle")}
                </p>

                <Collapse show={discountPercent > 0} className="mb-4">
                  <div className="flex gap-2 items-center">
                    <Badge className="bg-yellow-400 text-black text-base font-semibold px-2 py-1 rounded-full">
                      -{discountPercent}%
                    </Badge>
                    <Badge className="bg-yellow-400 text-black text-base font-semibold px-2 py-1 rounded-full">
                      {t("common.saleUpperCase")}
                    </Badge>
                  </div>
                </Collapse>
              </motion.div>
            </AnimatePresence>

            <div style={{ backgroundColor: bgColor }} className="rounded-xl p-4 mb-4">
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, layout: { duration: 0.25 } }}
                  className="w-full rounded-xl flex flex-col gap-4"
                >
                  <Collapse show={discountPercent > 0 && !(product?.name === ProductName.COMPLEX && selectedQuantity >= 3)}>
                    <div className="flex items-center text-base font-semibold text-red-600 gap-1 mb-4 bg-white p-4 rounded-lg">
                      <Flame className="w-4 h-4" />
                      {t("common.forYou")} {discountPercent}% {t("common.sale")} • {isChecked ? count : quantity} {t("common.quantity")}
                    </div>
                  </Collapse>


                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, layout: { duration: 0.25 } }}
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
                          transition={{ duration: 0.3, layout: { duration: 0.25 } }}
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
                  transition={{ duration: 0.3, layout: { duration: 0.25 } }}
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
              <Collapse show={isChecked}>
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
              </Collapse>

            </div>

            <motion.div layout transition={{ layout: { duration: 0.25 } }} className="flex items-center gap-5 mb-4">
              <div
                style={{ color: selectedQuantity === 1 ? color : "red" }}
                className="text-3xl font-bold"
              >
                {formatPrice(totalPrice)} {t("common.sum", "so'm")}
              </div>
              <Collapse show={selectedQuantity !== 1}>
                <span className="text-gray-500 text-lg line-through block">
                  {formatPrice(basePrice * selectedQuantity)} {t("common.sum")}
                </span>
              </Collapse>
            </motion.div>

            {/* <div className="flex items-center justify-start gap-5"> */}
            <FormModal
              products={
                product?.id
                  ? [{
                    productId: product.id,
                    quantity: selectedQuantity,
                    total: totalPrice
                  }]
                  : []
              }
              btnColor={color}
            >
              <Button
                size={"lg"}
                onClick={handleClick}
                style={{ backgroundColor: color, padding: "1.5rem" }}
                className={cn(
                  bgColor ? `bg-${bgColor}` : null,
                  "w-full mb-5 text-white text-lg font-semibold rounded-lg cursor-pointer transition-all"
                )}
              >
                {t("common.buy")}
              </Button>
            </FormModal>

            <Button
              size={"lg"}
              style={{ backgroundColor: color, padding: "1.5rem" }}
              onClick={handleAddToCart}
              className="w-full text-white text-lg font-semibold rounded-lg cursor-pointer transition-all"
            >
              {t("product.addToCart")}
            </Button>
            {/* </div> */}

            {/* {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )} */}

          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
