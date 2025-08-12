"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Clock } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

interface DiscountPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export function DiscountPopup({ isVisible, onClose }: DiscountPopupProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleDiscountClick = () => {
    router.push("/product");
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="relative bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl shadow-2xl overflow-hidden border border-emerald-200">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-200 rounded-full opacity-50" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-200 rounded-full opacity-30" />
              
              {/* Header with Logo (calmer) */}
              <div className="relative px-6 pt-8 pb-4 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-white/80 shadow-sm backdrop-blur"
                >
                  <Image src="/logo.png" alt="Nutva" width={56} height={56} className="object-contain p-2" />
                </motion.div>
                <h2 className="text-xl font-semibold text-emerald-800">{t("discountPopup.title", "Siz uchun maxsus chegirma")}</h2>
                <p className="mt-1 text-sm text-emerald-700">{t("discountPopup.subtitle", "Sog'lig'ingiz uchun sifatli qo'shimchalar")}</p>
              </div>

              {/* Discount Section (calm, no animated pointer) */}
              <div className="px-6 py-4">
                <motion.button
                  type="button"
                  onClick={handleDiscountClick}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group relative w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-center text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
                  aria-label={t("discountPopup.ariaDiscount", "25% chegirma – birinchi buyurtmangiz uchun, bosib mahsulotlarga o'ting")}
                >
                  {/* Click hint (moved to bottom-right corner) */}
                  <div className="pointer-events-none absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium tracking-wide text-white/90">
                    <span aria-hidden>👆</span>
                    <span className="hidden sm:inline">Bosish</span>
                  </div>
                  <div className="text-3xl font-semibold tracking-tight mb-2">{t("discountPopup.discountLabel", "25% chegirma")}</div>
                  <div className="text-sm opacity-90">{t("discountPopup.discountForFirst", "Birinchi buyurtmangiz uchun")}</div>
                  <div className="mt-3 flex items-center justify-center gap-2 text-emerald-100 text-xs">
                    <Leaf className="h-4 w-4" /> {t("discountPopup.qualityGuarantee", "Yuqori sifat kafolati")}
                  </div>
                </motion.button>
              </div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="px-6 py-3"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-700 mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{t("discountPopup.limitedTimeOffer", "Cheklangan vaqt taklifi")}</span>
                </div>
                
                <div className="flex justify-center gap-2">
                  {[
                    { label: t("discountPopup.hours", "Soat"), value: timeLeft.hours },
                    { label: t("discountPopup.minutes", "Daq"), value: timeLeft.minutes },
                    { label: t("discountPopup.seconds", "Son"), value: timeLeft.seconds }
                  ].map(item => (
                    <div key={item.label} className="flex flex-col items-center">
                      <div className="bg-emerald-600 text-white rounded-lg px-3 py-2 min-w-[3rem] text-center">
                        <div className="text-lg leading-none">{item.value.toString().padStart(2, '0')}</div>
                      </div>
                      <div className="text-xs text-emerald-600 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="px-6 pb-6 space-y-3"
              >
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl shadow-lg cursor-pointer"
                  onClick={handleDiscountClick}
                >
                  {t("discountPopup.claimDiscount", "Chegirmani oling")}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full text-emerald-700 hover:bg-emerald-100 py-2 cursor-pointer"
                >
                  {t("discountPopup.later", "Keyinroq")}
                </Button>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-1">🌱</div>
                    <span className="text-xs text-emerald-700">{t("discountPopup.benefitNatural", "Tabiiy")}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-1">✅</div>
                    <span className="text-xs text-emerald-700">{t("discountPopup.benefitQuality", "Sifatli")}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-1">🚚</div>
                    <span className="text-xs text-emerald-700">{t("discountPopup.benefitFreeDelivery", "Bepul yetkazish")}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}