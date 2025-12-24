"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Clock, Gift, Shield, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ContactPopupForm } from "./ContactPopupForm";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

interface DiscountPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export function DiscountPopup({ isVisible, onClose }: DiscountPopupProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
  const { t } = useTranslation();
  const lowPowerMode = useLowPowerMode();

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
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative max-h-[calc(100vh-2rem)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-white via-emerald-50 to-green-50 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-10 cursor-pointer rounded-full border border-gray-200 bg-white p-2 shadow-md transition-colors hover:bg-gray-50 sm:right-4 sm:top-4"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-300 to-green-300 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full opacity-10 blur-3xl" />
              
              {/* Header with Logo */}
              <div className="relative px-4 pb-3 pt-6 text-center sm:px-5 sm:pt-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg sm:h-16 sm:w-16"
                >
                  <Gift className="w-7 h-7 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent sm:text-xl">
                    {t("discountPopup.title", "� 3+2 Aksiya!")}
                  </h2>
                  <p className="mt-1.5 text-sm font-medium text-gray-600">
                    {t("discountPopup.subtitle", "3 ta oling, 2 ta bepul!")}
                  </p>
                </motion.div>
              </div>

              {/* Discount Section */}
              <div className="px-4 py-2 sm:px-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 p-4 text-center text-white shadow-xl sm:p-6"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />
                  
                  <motion.div
                    animate={lowPowerMode ? undefined : { scale: [1, 1.05, 1] }}
                    transition={lowPowerMode ? undefined : { duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                    <div className="mb-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                      {t("discountPopup.discountLabel", "3 + 2 BEPUL")}
                    </div>
                    <div className="text-sm font-medium opacity-95">
                      {t("discountPopup.discountForFirst", "🎁 Complex + Extra sovg'a")}
                    </div>
                  </motion.div>
                  
                  <div className="mt-3 flex items-center justify-center gap-2.5 text-xs text-emerald-50">
                    <div className="flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5" />
                      <span>{t("discountPopup.natural", "Tabiiy")}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/60" />
                    <div className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" />
                      <span>{t("discountPopup.quality", "Halol")}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="px-4 py-3 sm:px-5"
              >
                <div className="flex items-center justify-center gap-2 text-gray-700 mb-3">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold">{t("discountPopup.limitedTimeOffer", "⏰ Aksiya tugaydi:")}</span>
                </div>
                
                <div className="flex justify-center gap-2.5">
                  {[
                    { label: t("discountPopup.hours", "Soat"), value: timeLeft.hours },
                    { label: t("discountPopup.minutes", "Daq"), value: timeLeft.minutes },
                    { label: t("discountPopup.seconds", "Son"), value: timeLeft.seconds }
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label} 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="min-w-[2.75rem] rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 px-2.5 py-2 text-center text-white shadow-lg sm:min-w-[3rem]">
                        <div className="text-lg font-bold leading-none sm:text-xl">{item.value.toString().padStart(2, '0')}</div>
                      </div>
                      <div className="text-[10px] text-gray-600 mt-1.5 font-medium">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2.5 px-4 pb-4 sm:px-5"
              >
                <ContactPopupForm onClose={onClose}>
                  <Button className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:from-emerald-700 hover:to-green-700 hover:shadow-2xl sm:py-5">
                    <Gift className="w-4 h-4 mr-2" />
                    {t("discountPopup.claimDiscount", "Aksiyani olish")}
                  </Button>
                </ContactPopupForm>
                
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full cursor-pointer py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  {t("discountPopup.later", "Keyinroq qarayman")}
                </Button>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="px-4 pb-5 sm:px-5"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <motion.div 
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-md sm:h-10 sm:w-10">
                        <span className="text-xl">🌱</span>
                      </div>
                      <span className="text-[10px] text-gray-700 font-semibold">{t("discountPopup.benefitNatural", "100% Tabiiy")}</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-md sm:h-10 sm:w-10">
                        <span className="text-xl">✅</span>
                      </div>
                      <span className="text-[10px] text-gray-700 font-semibold">{t("discountPopup.benefitQuality", "Halol")}</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-md sm:h-10 sm:w-10">
                        <span className="text-xl">🚚</span>
                      </div>
                      <span className="text-[10px] text-gray-700 font-semibold">{t("discountPopup.benefitFreeDelivery", "Bepul yetkazish")}</span>
                    </motion.div>
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