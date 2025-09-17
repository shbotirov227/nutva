"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Globe, 
  Youtube, 
  Send, 
  ShoppingBag, 
  Facebook, 
  Phone, 
  LucideIcon
} from 'lucide-react';

const TaplinkCard = ({ 
  href, 
  icon: Icon, 
  title, 
  description, 
  color = "from-green-400 to-emerald-600",
  delay = 0
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}) => (
  <div
    className="group animate-fade-in hover:animate-lift"
    style={{ animationDelay: `${delay * 100}ms` }}
  >
    <Link 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={`${title} - ${description}`}
      className="block p-6 rounded-2xl bg-white border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:bg-green-50/50 hover:border-green-200"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            {description}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      </div>
    </Link>
  </div>
);

export default function TaplinksPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const links = [
    {
      href: "https://nutva.uz",
      icon: Globe,
      title: "Nutva.uz",
      description: "Rasmiy veb-sayt | Official Website",
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      href: "https://www.youtube.com/@NutvaUz",
      icon: Youtube,
      title: "YouTube Channel",
      description: "Video kontentlar va mahsulot haqida ma'lumot",
      color: "from-red-500 to-red-600",
      delay: 0.2
    },
    {
      href: "https://t.me/Nutva_Complex",
      icon: Send,
      title: "Telegram Channel",
      description: "Yangiliklar va maxsus takliflar",
      color: "from-blue-400 to-cyan-500",
      delay: 0.3
    },
    {
      href: "https://uzum.uz/ru/product/nutva-complex-dlya-1045048",
      icon: ShoppingBag,
      title: "Uzum.uz",
      description: "Onlayn xarid qilish | Online Shopping",
      color: "from-purple-500 to-pink-500",
      delay: 0.4
    },
    {
      href: "https://www.facebook.com/NUTVAC0MPLEX/",
      icon: Facebook,
      title: "Facebook",
      description: "Ijtimoiy tarmoq sahifamiz",
      color: "from-blue-600 to-blue-700",
      delay: 0.5
    }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes lift {
          to {
            transform: translate3d(0, -5px, 0) scale(1.02);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .animate-lift:hover {
          animation: lift 0.3s ease-out forwards;
          will-change: transform;
        }
      `}</style>
      
      <div className="min-h-screen bg-green-50 relative overflow-hidden" style={{ backgroundColor: '#DCFCE8' }}>
        {/* Main content */}
        <div className="relative z-10 max-w-md mx-auto px-6 py-12">
          {/* Header section */}
          <div className="text-center mb-12 animate-fade-in">
            {/* Logo */}
            <div className="relative mb-8">
              <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-600 shadow-2xl flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Nutva - Biologik faol qo'shimcha mahsulotlari ishlab chiqaruvchi kompaniya logotipi"
                  width={140}
                  height={140}
                  className="rounded-full"
                  priority
                  loading="eager"
                />
              </div>
            </div>

            {/* Company description */}
            <p className="text-gray-600 text-lg mb-3 leading-relaxed font-medium">
              Biologik faol qo&apos;shimcha mahsulotlari
            </p>
            
            <p className="text-gray-500 text-base font-medium">
              Oilangiz uchun tabiiy g&apos;amxo&apos;rlik
            </p>

            {/* Decorative line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mt-8"></div>
          </div>

          {/* Links section */}
          <div className="space-y-4 mb-8">
            {links.map((link, index) => (
              <TaplinkCard key={index} {...link} />
            ))}
          </div>

          {/* Contact section */}
          <div className="text-center p-6 rounded-2xl bg-white border border-green-200 shadow-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 rounded-full bg-green-50 border border-green-200">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ma&apos;lumot olish uchun
            </h3>
            <Link 
              href="tel:1294"
              aria-label="Call 1294 for customer support"
              className="inline-block text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              1294
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              24/7 yordam xizmati
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-gray-400 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <p>© 2024 Nutva. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center justify-center mt-2 space-x-1">
              <span>Tabiiy</span>
              <span className="text-red-400">♥</span>
              <span>Sifatli</span>
              <span className="text-yellow-400">✨</span>
              <span>Ishonchli</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}