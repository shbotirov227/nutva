"use client";

import { useMemo, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LangContext";

export type ProductReviewSlide = {
  id: string;
  author: string;
  tag: string;
  rating: number;
  body: string;
};

type ProductReviewSliderProps = {
  productName?: string | null;
  accentColor?: string;
  surfaceColor?: string;
};

const hexToRgba = (hexColor?: string, alpha = 1) => {
  if (!hexColor) return `rgba(0, 0, 0, ${alpha})`;
  let hex = hexColor.trim().replace("#", "");
  if (![3, 6].includes(hex.length)) return `rgba(0, 0, 0, ${alpha})`;
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getSlidesForProduct = (name?: string | null): ProductReviewSlide[] => {
  if (!name) return [];
  const n = name.toLowerCase();

  if (n.includes("complex extra")) {
    return [
      {
        id: "complex-extra-1",
        author: "Umidjon, 42 yosh",
        tag: "Faol hayot",
        rating: 4.8,
        body:
          "Nutva Complex Extra kursidan keyin bo'g'imlardagi taranglik va og'riq ancha kamaydi. Ish kunini faol o'tkazish, zinadan chiqish va uzoq yurish osonlashdi.",
      },
      {
        id: "complex-extra-2",
        author: "Dilnoza, ofis xodimi",
        tag: "Charchoq kamaydi",
        rating: 4.9,
        body:
          "Kundalik kompyuter oldidagi ishlarimdan keyin bel va bo'yindagi og'riqlar qiynardi. Complex Extra'ni qabul qilishni boshlaganimdan so'ng charchoq kamroq, uyqu esa chuqurroq bo'la boshladi.",
      },
      {
        id: "complex-extra-3",
        author: "Rustam, 38 yosh",
        tag: "Sportdan keyin tiklanish",
        rating: 4.9,
        body:
          "Sport zalidan keyingi muskullardagi noqulaylik va bo'g'imlardagi taranglikni kamaytirish uchun Complex Extra juda qo'l keldi. Ertasi kuni ham o'zimni tetik his qilaman.",
      },
    ];
  }

  if (n.includes("gelmin kids")) {
    return [
      {
        id: "gelmin-kids-1",
        author: "Madina, 6 yoshli farzand onasi",
        tag: "Bolalar uchun xavfsiz",
        rating: 4.7,
        body:
          "Gelmin Kids kursidan so'ng bolamning ishtahasi ochildi, uyqusi tinchlandi va terisidagi mayda toshmalar asta-sekin yo'qoldi. Eng muhimi, tarkibi tabiiy bo'lgani uchun o'zimni xotirjam his qilaman.",
      },
      {
        id: "gelmin-kids-2",
        author: "Aziza, uch farzand onasi",
        tag: "Profilaktika",
        rating: 4.8,
        body:
          "Maktab va bog'chada tez-tez shamollashlar bo'lgan davrda Gelmin Kidsni profilaktika sifatida berdik. Bolalar ko'proq tetik, ichaklar bilan bog'liq noqulayliklar ancha kamaydi.",
      },
      {
        id: "gelmin-kids-3",
        author: "Javohir, 9 yoshli o'g'il otasi",
        tag: "Tinch uyqu",
        rating: 4.9,
        body:
          "Kechasi tish g'ijirlatish va bezovta uyqu muammosi bor edi. Gelmin Kids qabul qilgandan keyin bolam tinch uxlaydi, ertalab esa tetik turadi.",
      },
    ];
  }

  if (n.includes("complex")) {
    return [
      {
        id: "complex-1",
        author: "Zafar, faol hayot tarafdori",
        tag: "Bo'g'imlar erkinligi",
        rating: 4.9,
        body:
          "Nutva Complexni bir necha hafta qabul qilganimdan so'ng bo'g'imlardagi og'irlik va qotib qolish hissi kamaydi. Sport zali va ish orasidagi balansi saqlash osonlashdi.",
      },
      {
        id: "complex-2",
        author: "Saida, 55 yosh",
        tag: "Kundalik harakat",
        rating: 4.8,
        body:
          "Oldin zinadan chiqish yoki uzoq piyoda yurish qiyin edi. Complex kursidan keyin ertalabki og'riqlar yumshadi, kun bo'yi o'zimni yengil his qila boshladim.",
      },
      {
        id: "complex-3",
        author: "Nodira, 36 yosh",
        tag: "Ofis ishida qulaylik",
        rating: 4.8,
        body:
          "Kun bo'yi stol yonida o'tirish bel va bo'yin uchun qiyin edi. Complexni qabul qilgach, qotib qolish hissi kamaydi va ish kunining oxirida ham energiyam yetarli bo'ladi.",
      },
    ];
  }

  return [];
};

export default function ProductReviewSlider({ productName, accentColor, surfaceColor }: ProductReviewSliderProps) {
  const { lang } = useLang();
  const slides = useMemo(() => getSlidesForProduct(productName), [productName]);

  const [index, setIndex] = useState<number>(0);

  if (!slides.length) return null;

  const current = slides[index];
  const accent = accentColor || "#047857";
  const surface = surfaceColor || "#ECFDF5";
  const softAccent = hexToRgba(accent, 0.2);
  const borderColor = hexToRgba(accent, 0.35);
  const reviewTagBg = hexToRgba(accent, 0.1);
  const gradientBg = `linear-gradient(135deg, rgba(255,255,255,0.96), ${hexToRgba(surface, 0.82)})`;

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="relative mb-10 w-full max-w-4xl overflow-hidden rounded-3xl border px-5 py-6 sm:px-8 sm:py-9 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur"
      style={{
        borderColor,
        background: gradientBg,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 -right-16 hidden sm:block w-64 rounded-full blur-3xl"
        style={{ background: softAccent }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: accent }}>
              {productName}
            </p>
            <p
              className="inline-flex mt-3 items-center rounded-full px-4 py-1.5 text-[11px] sm:text-xs font-semibold"
              style={{ background: reviewTagBg, color: accent }}
            >
              {current.tag}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 text-slate-900 shadow-inner">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="w-4 h-4" style={{ color: accent }} fill={accent} />
              ))}
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-semibold text-slate-800 tabular-nums">
                {current.rating.toFixed(1)}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                {lang === "ru" ? "Отзывы" : lang === "en" ? "Reviews" : "Izohlar"}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-base sm:text-lg leading-relaxed text-slate-900/90"
          >
            {current.body}
          </motion.p>
        </AnimatePresence>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-700/90">{current.author}</p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full border"
              style={{ borderColor, color: accent }}
              onClick={handlePrev}
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {slides.map((slide, i) => (
                <span
                  key={slide.id}
                  className="h-1.5 w-6 rounded-full transition-all"
                  style={{
                    background: i === index ? accent : softAccent,
                    opacity: i === index ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full border"
              style={{ borderColor, color: accent }}
              onClick={handleNext}
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
