"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
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
        <a
          href="tel:1294"
          title="Qo'ng'iroq qilish"
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
            size="icon"
            className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 cursor-pointer"
          >
            <Phone size={20} className="w-15 h-15 text-white" />
          </Button>
        </a>

        <Button
          onClick={() => setIsChatOpen((prev) => !prev)}
          variant="default"
          size="icon"
          className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 cursor-pointer"
          title="Admin bilan yozishish"
        >
          <MessageCircle size={20} className="w-15 h-15 text-white" />
        </Button>
      </div>

      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default FloatingButtons;
