"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface ComplexPromoBannerProps {
  color?: string;
  bgColor?: string;
}

export function ComplexPromoBanner({ color = "#166534", bgColor = "#D8F6D1" }: ComplexPromoBannerProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}f5 100%)`,
        border: `3px solid ${color}60`,
      }}
    >
      {/* Main content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 md:p-8">
        {/* Left side - Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center md:justify-start"
        >
          <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-square">
            <Image
              src="/ComplexPromoBanner.png"
              alt="Complex Promo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Right side - Text content */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight"
            style={{ color }}
          >
            {t("complexPromo.title", "🎁 Maxsus Taklif!")}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl font-bold text-gray-800 leading-relaxed"
          >
            {t(
              "complexPromo.description",
              "3 ta Complex mahsulot sotib oling, 2 ta Complex Extra sovg'a sifatida bepul oling!"
            )}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
          >
            <span className="text-xl">⭐</span>
            <span className="text-sm md:text-base font-semibold text-gray-700">
              {t("complexPromo.hint", "Chegirma avtomatik ravishda qo'llaniladi")}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
