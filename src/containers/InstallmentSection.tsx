"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CreditCard, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const InstallmentSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const featuresTexts = t("installment.features", { returnObjects: true }) as unknown;
  const featuresArray: string[] = Array.isArray(featuresTexts) ? (featuresTexts as string[]) : [];
  const features = [
    { icon: CreditCard, text: featuresArray[0] ?? "" },
    { icon: TrendingUp, text: featuresArray[1] ?? "" },
    { icon: Sparkles, text: featuresArray[2] ?? "" },
  ];

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] border border-emerald-200/60 bg-white/85 shadow-xl backdrop-blur"
        >
          {/* Gradient ring like BlogCard */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[28px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.35), rgba(59,130,246,0.20))",
              mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
              WebkitMask:
                "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            }}
          />

          <div className="relative z-10 grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#218A4F]/30 bg-[#218A4F]/10 px-4 py-1.5 backdrop-blur-sm"
              >
                <Sparkles className="size-4 text-[#218A4F]" />
                <span className="text-[#218A4F]">{t("installment.badge")}</span>
              </motion.div>

              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-950 leading-tight">
                  {t("installment.title")}
                </h2>
                <p className="text-emerald-900/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                  {t("installment.subtitle")}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2 rounded-2xl border border-emerald-200/60 bg-white/85 px-4 py-2.5 shadow-sm"
                  >
                    <feature.icon className="size-4 text-[#218A4F]" />
                    <span className="text-emerald-900">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="pt-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 text-white border-0 shadow-md"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <a
                    href="https://uzum.uz/ru/shop/nutva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: "-100%" }}
                      animate={isHovered ? { x: "100%" } : { x: "-100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative">{t("installment.cta")}</span>
                    <ArrowUpRight className="relative size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                {/* Subtle Glow */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-400/10 to-sky-400/10 opacity-70 blur-2xl transition-all duration-500 group-hover:opacity-100 group-hover:-inset-6" />
                
                {/* Card Container */}
                <div className="relative rounded-3xl border border-emerald-200/60 bg-none p-6 backdrop-none">
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 size-8 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-3xl" />
                  <div className="absolute -top-1 -right-1 size-8 border-t-2 border-r-2 border-emerald-500/50 rounded-tr-3xl" />
                  <div className="absolute -bottom-1 -left-1 size-8 border-b-2 border-l-2 border-emerald-500/50 rounded-bl-3xl" />
                  <div className="absolute -bottom-1 -right-1 size-8 border-b-2 border-r-2 border-emerald-500/50 rounded-br-3xl" />
                  
                  {/* Image - Uzum logo */}
                  <div className="relative size-48 sm:size-64 lg:size-72 flex items-center justify-center">
                    <Image
                      src="/uzumm.png"
                      alt={t("installment.imageAlt")}
                      width={300}
                      height={300}
                      className="size-full rounded-2xl object-contain"
                      priority={false}
                    />
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 p-3 shadow-lg shadow-emerald-500/40"
                  >
                    <CreditCard className="size-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default InstallmentSection;