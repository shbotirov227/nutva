"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Lazy-load ChatBox (and its heavy deps like react-phone-input-2) only when needed
const ChatBox = dynamic(() => import("./ChatBox"), { ssr: false });

const FloatingButtons = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-40"
          }`}
      >
        <Button
          onClick={() => setIsChatOpen((prev) => !prev)}
          variant="default"
          className="relative px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 cursor-pointer text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Admin bilan yozishish"
          style={{
            clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
            borderRadius: "8px"
          }}
        >
          <MessageCircle size={26} className="relative z-10" />
          <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" 
               style={{clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)"}} />
        </Button>

        <a
          href="tel:1294"
          title="Qo'ng'iroq qilish - 1294"
          onClick={(e) => {
            try {
              // If global helper exists, use it to delay navigation until GA event is sent
              if (typeof window !== 'undefined' && typeof window.gtagSendEvent === 'function') {
                e.preventDefault();
                window.gtagSendEvent('tel:1294');
              }
            } catch {}
          }}
        >
          <Button
            variant="default"
            className="relative px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{
              clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
              borderRadius: "8px"
            }}
          >
            <span className="relative z-10 tracking-wider flex items-center gap-2">
              <Phone size={20} />
              1294
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" 
                 style={{clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)"}} />
          </Button>
        </a>
      </div>

      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default FloatingButtons;
