"use client";

import { useMemo, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ProductReviewSlider({ productName }: ProductReviewSliderProps) {
  const { lang } = useLang();
  const slides = useMemo(() => getSlidesForProduct(productName), [productName]);

  const [index, setIndex] = useState<number>(0);

  if (!slides.length) return null;

  const current = slides[index];

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="mb-10 w-full max-w-3xl rounded-3xl bg-white shadow-lg border border-emerald-100/80 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-emerald-500 font-semibold">
            {productName}
          </p>
          <p className="inline-flex mt-2 items-center rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-emerald-700">
            {current.tag}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-sm font-semibold text-emerald-900 tabular-nums">
            {current.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-emerald-800/70">
            {lang === "ru" ? "Отзывы" : lang === "en" ? "Reviews" : "Izohlar"}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="text-sm sm:text-base leading-relaxed text-emerald-900/90 min-h-[90px]"
        >
          {current.body}
        </motion.p>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs sm:text-sm font-medium text-emerald-700/90">
          {current.author}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={handlePrev}
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
            {slides.map((slide, i) => (
              <span
                key={slide.id}
                className={
                  "h-1.5 w-1.5 rounded-full transition-colors " +
                  (i === index ? "bg-emerald-500" : "bg-emerald-200")
                }
              />
            ))}
          </div>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={handleNext}
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
