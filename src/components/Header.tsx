"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Container from "./Container";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
      "text-white px-4 text-xl transition-all delay-75 pb-2 border-b-transparent border-b-2 hover:border-b-white focus:outline-none focus-visible:ring-2 ring-white " +
      className
    }
    onClick={onClick}
    tabIndex={0}
  >
    {children}
  </Link>
);

const Header: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);
  const firstNavRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const navLinks = useMemo(() => [
    { href: "/", label: t("nav.home") },
    { href: "/product", label: t("nav.products") },
    { href: "/about-us", label: t("nav.about") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
    // { href: "/admin", label: "Admin" },
  ], [t]);

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
                  <li key={item.href}>
                    <NavLink href={item.href}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <LanguageSwitcher />
            <button
              className="md:hidden flex items-center justify-center p-2"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={32} />
            </button>
          </div>
        </Container>
      </header>
      {mobileMenu && (
        <div
          ref={menuRef}
          className={`
            fixed inset-0 z-[9999] flex flex-col bg-[rgba(20,20,20,0.85)] backdrop-blur-lg transition-all duration-300 animate-fadein
            overflow-y-auto
          `}
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
            <button
              onClick={() => setMobileMenu(false)}
              className="text-white p-2"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
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
            <LanguageSwitcher />
          </nav>
        </div>
      )}
      <style jsx global>{`
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
      `}</style>
    </>
  );
};

export default Header;
