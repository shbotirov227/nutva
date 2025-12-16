"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Clock, Gift, Shield, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ContactPopupForm } from "./ContactPopupForm";

interface DiscountPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export function DiscountPopup({ isVisible, onClose }: DiscountPopupProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="relative bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-300">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md cursor-pointer border border-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-300 to-green-300 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full opacity-10 blur-3xl" />
              
              {/* Header with Logo */}
              <div className="relative px-6 pt-10 pb-4 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg"
                >
                  <Gift className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                    {t("discountPopup.title", "🎉 Maxsus Taklif!")}
                  </h2>
                  <p className="mt-2 text-base text-gray-600 font-medium">
                    {t("discountPopup.subtitle", "Chegirma olish uchun ma'lumotlaringizni qoldiring")}
                  </p>
                </motion.div>
              </div>

              {/* Discount Section */}
              <div className="px-6 py-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 p-8 text-center text-white shadow-xl"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />
                  
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                    <div className="text-4xl font-bold tracking-tight mb-2">
                      {t("discountPopup.discountLabel", "25% CHEGIRMA")}
                    </div>
                    <div className="text-lg font-medium opacity-95">
                      {t("discountPopup.discountForFirst", "🎁 Birinchi buyurtmangiz uchun")}
                    </div>
                  </motion.div>
                  
                  <div className="mt-4 flex items-center justify-center gap-3 text-emerald-50 text-sm">
                    <div className="flex items-center gap-1">
                      <Leaf className="h-4 w-4" />
                      <span>{t("discountPopup.natural", "Tabiiy")}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/60" />
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
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
                className="px-6 py-4"
              >
                <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold">{t("discountPopup.limitedTimeOffer", "⏰ Chegirma tugash vaqti:")}</span>
                </div>
                
                <div className="flex justify-center gap-3">
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
                      <div className="bg-gradient-to-br from-emerald-600 to-green-600 text-white rounded-xl px-4 py-3 min-w-[3.5rem] text-center shadow-lg">
                        <div className="text-2xl font-bold leading-none">{item.value.toString().padStart(2, '0')}</div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 font-medium">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="px-6 pb-6 space-y-3"
              >
                <ContactPopupForm onClose={onClose}>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] cursor-pointer">
                    <Gift className="w-5 h-5 mr-2" />
                    {t("discountPopup.claimDiscount", "Chegirmani olish")}
                  </Button>
                </ContactPopupForm>
                
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full text-gray-600 hover:bg-gray-100 py-3 cursor-pointer font-medium"
                >
                  {t("discountPopup.later", "Keyinroq qarayman")}
                </Button>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="px-6 pb-8"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <motion.div 
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                        <span className="text-2xl">🌱</span>
                      </div>
                      <span className="text-xs text-gray-700 font-semibold">{t("discountPopup.benefitNatural", "100% Tabiiy")}</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                        <span className="text-2xl">✅</span>
                      </div>
                      <span className="text-xs text-gray-700 font-semibold">{t("discountPopup.benefitQuality", "Halol")}</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                        <span className="text-2xl">🚚</span>
                      </div>
                      <span className="text-xs text-gray-700 font-semibold">{t("discountPopup.benefitFreeDelivery", "Bepul yetkazish")}</span>
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