"use client";

import React from "react";
import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { FaFacebookF, FaInstagram, FaTwitter, FaTelegramPlane, FaYoutube } from "react-icons/fa";

const FooterLinks = [
  { title: "Главная", url: "/" },
  { title: "Продукты", url: "/product" },
  { title: "О бренде", url: "/about-us" },
  { title: "Блог", url: "/blog" },
  { title: "Контакты", url: "/contact" },
];

const SocialLinks = [
  { title: "Facebook", url: "https://www.facebook.com/NUTVAC0MPLEX", icon: FaFacebookF },
  { title: "Instagram", url: "https://www.instagram.com/nutva.uz", icon: FaInstagram },
  { title: "Twitter", url: "https://x.com/Nutva_uz", icon: FaTwitter },
  { title: "Telegram", url: "https://t.me/nutva_uz", icon: FaTelegramPlane },
  { title: "Youtube", url: "https://www.youtube.com/@NutvaUz", icon: FaYoutube },
];

const FooterLink = ({
  title,
  url,
  className,
  external = false,
  icon: Icon,
}: {
  title: string;
  url: string;
  className?: string;
  external?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) => (
  <li className="py-1">
    <Link
      href={url}
      className={clsx(
        "flex items-center gap-3 transition-all border-b-2 border-b-transparent hover:border-b-white text-base md:text-lg group",
        className
      )}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      aria-label={title}
    >
      {Icon && (
        <Icon
          size={22}
          className="text-white opacity-80 group-hover:text-[#218A4F] transition-all duration-200"
        />
      )}
      {title}
    </Link>
  </li>
);

const PhoneLink = ({
  title,
  url,
  className,
}: {
  title: string;
  url: string;
  className?: string;
}) => (
  <li className="py-1 list-disc ml-3">
    <Link
      href={url}
      className={clsx(
        "transition-all border-b-2 border-b-transparent hover:border-b-white",
        className
      )}
      aria-label={title}
    >
      {title}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-[#2B2B2B] text-white pt-20 pb-10 mt-8">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
        {/* Logo & About */}
        <div className="mb-10 md:mb-0 flex flex-col">
          <Image
            src="/nutva-logo.png"
            alt="Nutva logo"
            width={180}
            height={40}
            className="mb-8"
          />
          <p className="text-white text-sm md:text-base opacity-80">
            NUTVA Complex — это натуральный и экологически чистый продукт высокого качества, созданный из трав Средней Азии и Европы по рецептам народной медицины.
          </p>
        </div>
        {/* Contacts */}
        <div className="mb-10 md:mb-0">
          <h4 className="text-2xl font-bold mb-7">Контакты</h4>
          <ul className="text-white opacity-90 text-base space-y-3">
            <li>
              Колл-центр:
              <ul>
                <PhoneLink title="1294" url="tel:1294" />
                <PhoneLink title="+998 71 211-11-12" url="tel:+998712111112" />
              </ul>
            </li>
            <li>
              Эл. адрес:{" "}
              <Link
                href="mailto:info@nutva.uz"
                className="hover:underline ml-1"
              >
                info@nutva.uz
              </Link>
            </li>
            <li>Адрес: Узбекистан, Ташкент</li>
            <li>
              По вопросам сотрудничества:
              <ul>
                <PhoneLink title="+998 95 185-10-01" url="tel:+998951851001" />
                <PhoneLink title="info@nutva.uz" url="mailto:info@nutva.uz" />
              </ul>
            </li>
          </ul>
        </div>
        {/* Quick links */}
        <div className="mb-10 md:mb-0">
          <h4 className="text-2xl font-bold mb-7">Быстрые ссылки</h4>
          <ul>
            {FooterLinks.map((link) => (
              <FooterLink key={link.title} title={link.title} url={link.url} />
            ))}
          </ul>
        </div>
        {/* Social links */}
        <div>
          <h4 className="text-2xl font-bold mb-7">Социальные сети</h4>
          <ul>
            {SocialLinks.map((link) => (
              <FooterLink
                key={link.title}
                title={link.title}
                url={link.url}
                icon={link.icon}
                external
              />
            ))}
          </ul>
        </div>
      </Container>
      <div className="text-center text-sm text-white/50 mt-10">
        &copy; {new Date().getFullYear()} NUTVA Complex. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
