"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Container from "./Container";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
// import { AnimatePresence } from "framer-motion";

const NavLink = ({
  href,
  children,
  onClick,
  className = "",
  refProp,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  refProp?: React.Ref<HTMLAnchorElement>;
}) => (
  <Link
    href={href}
    ref={refProp}
    className={
      "text-white px-4 min-lg:px-2 text-xl max-h-lg:text-lg transition-all delay-75 pb-2 border-b-transparent border-b-2 hover:border-b-white focus:outline-none focus-visible:ring-2 ring-white " +
      className
    }
    onClick={onClick}
    tabIndex={0}
  >
    {children}
  </Link>
);

const Header: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);
  const firstNavRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();
  const { cart } = useCart();
  const cartCount = cart.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = useMemo(() => [
    { href: "/", label: t("nav.home") },
    { href: "/product", label: t("nav.products") },
    { href: "/sale", label: t("common.saleUpperCase") },
    { href: "/about-us", label: t("nav.about") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
    // { href: "/admin", label: "Admin" },
  ].filter(link => !!link.href && !!link.label), [t]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 0) setVisible(true);
      else if (currentScrollY > lastScrollY.current) setVisible(false);
      else if (currentScrollY < lastScrollY.current) setVisible(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  useEffect(() => {
    if (!mobileMenu) return;
    setTimeout(() => firstNavRef.current?.focus(), 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenu(false);

      if (e.key === "Tab" && menuRef.current) {
        const focusableEls = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (!focusableEls.length) return;
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenu]);

  if (!mounted) return null;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] bg-white text-black px-4 py-2 rounded"
      >
        Skip to content
      </a>
      <header
        className={`
          fixed top-0 w-full box-border text-white py-4 shadow-md z-50
          bg-[rgba(20,20,20,0.7)] backdrop-blur-xl
          transition-transform duration-300
          ${visible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/nutva-logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="inline-block mr-2 w-[120px] h-auto"
                priority
              />
            </Link>
            <nav className="hidden md:flex mt-2 items-center">
              <ul className="flex space-x-5">
                {navLinks.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <NavLink href={item.href}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center justify-between gap-5">
              {/* <div className="flex items-center justify-between"> */}
              <Link href="/cart" className="relative">
                <ShoppingCart className="cursor-pointer" size={25} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <LanguageSwitcher />
              {/* </div> */}
              <Button
                size={"icon"}
                className="md:hidden flex items-center justify-center border p-2 cursor-pointer"
                onClick={() => setMobileMenu(true)}
                aria-label="Open menu"
              >
                <Menu size={32} />
              </Button>
            </div>


          </div>
        </Container>
      </header>
      {mobileMenu && (
        <AnimatePresence mode="wait">
          {/* Fon qorayishi */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/50"
            onClick={() => setMobileMenu(false)}
          />

          {/* Menyu o‘zi */}
          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "keyframes", stiffness: 500, damping: 80 }}
            className="fixed right-0 top-0 bottom-0 z-[9999] w-full sm:w-80 flex flex-col bg-[rgba(20,20,20,0.95)] backdrop-blur-lg overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4">
              <Link href="/" onClick={() => setMobileMenu(false)}>
                <Image
                  src="/nutva-logo.png"
                  alt="Logo"
                  width={100}
                  height={34}
                  className="w-[100px] h-auto"
                  priority
                />
              </Link>
              <Button
                size={"icon"}
                onClick={() => setMobileMenu(false)}
                className="text-white p-2 text-2xl border cursor-pointer"
                aria-label="Close menu"
              >
                <X size={32} />
              </Button>
            </div>
            <nav className="flex flex-col items-center mt-10 gap-6 mb-8">
              {navLinks.map((item, idx) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-2xl"
                  refProp={idx === 0 ? firstNavRef : undefined}
                >
                  {item.label}
                </NavLink>
              ))}

            </nav>
          </motion.div>
        </AnimatePresence>
      )}
      {/* <style jsx global>{`
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadein {
          animation: fadein 0.35s cubic-bezier(0.7, 0, 0.2, 1);
        }
      `}</style> */}
    </>
  );
};

export default Header;
