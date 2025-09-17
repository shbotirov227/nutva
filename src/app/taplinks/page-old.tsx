"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Youtube, 
  Send, 
  ShoppingBag, 
  Facebook, 
  Phone, 
  Star,
  Sparkles,
  Heart,
  Zap,
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
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    className="group"
  >
    <Link 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
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
  </motion.div>
);

const FloatingIcon = ({ 
  icon: Icon, 
  className, 
  animationDelay = 0 
}: { 
  icon: LucideIcon; 
  className: string; 
  animationDelay?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.3, 0.7, 0.3], 
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay: animationDelay,
      ease: "easeInOut"
    }}
    className={`absolute ${className}`}
  >
    <Icon className="w-6 h-6 text-green-400/40" />
  </motion.div>
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
    <div className="min-h-screen bg-green-50 relative overflow-hidden" style={{ backgroundColor: '#DCFCE8' }}>
      {/* Floating background elements */}
      <FloatingIcon icon={Sparkles} className="top-20 left-10" animationDelay={0} />
      <FloatingIcon icon={Heart} className="top-40 right-20" animationDelay={1} />
      <FloatingIcon icon={Zap} className="bottom-40 left-20" animationDelay={2} />
      <FloatingIcon icon={Star} className="bottom-20 right-10" animationDelay={3} />

      {/* Main content */}
      <div className="relative z-10 max-w-md mx-auto px-6 py-12">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            className="relative mb-8"
          >
            <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-600 shadow-2xl flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Nutva Logo"
                width={140}
                height={140}
                className="rounded-full"
              />
            </div>
          </motion.div>

          {/* Company description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 text-lg mb-3 leading-relaxed font-medium"
          >
            Biologik faol qo&apos;shimcha mahsulotlari
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-500 text-base font-medium"
          >
            Oilangiz uchun tabiiy g&apos;amxo&apos;rlik
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mt-8"
          ></motion.div>
        </motion.div>

        {/* Links section */}
        <div className="space-y-4 mb-8">
          {links.map((link, index) => (
            <TaplinkCard key={index} {...link} />
          ))}
        </div>

       
        {/* Contact section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center p-6 rounded-2xl bg-white border border-green-200 shadow-lg"
        >
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
            className="inline-block text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            1294
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            24/7 yordam xizmati
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-8 text-xs text-gray-400"
        >
          <p>© 2024 Nutva. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <span>Tabiiy</span>
            <Heart className="w-3 h-3 text-red-400" />
            <span>Sifatli</span>
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>Ishonchli</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}