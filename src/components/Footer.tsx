"use client";

import React from 'react'
import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

const FooterLinks = [
  { id: 1, title: "Главная", url: "/" },
  { id: 2, title: "Продукты", url: "/product" },
  { id: 3, title: "О бренде", url: "/about-us" },
  { id: 4, title: "Блог", url: "/blog" },
  { id: 5, title: "Контакты", url: "/contact" },
];

const SocialLinks = [
  { id: 1, title: "Facebook", url: "https://www.facebook.com/NUTVAC0MPLEX" },
  { id: 2, title: "Instagram", url: "https://www.instagram.com/nutva.uz" },
  { id: 3, title: "Twitter", url: "https://x.com/Nutva_uz" },
  { id: 4, title: "Telegram", url: "https://t.me/nutva_uz" },
  { id: 5, title: "Youtube", url: "https://www.youtube.com/@NutvaUz" },
];

const FooterLink = ({ title, url, className }: { title: string; url: string; className?: string }) => {
  return (
    <li className="mb-0 py-2">
      <Link
        href={url}
        className={clsx(
          "transition-all delay-75 pb-1 border-b-transparent border-b-2 hover:border-b-white",
          className
        )}
      >
        {title}
      </Link>
    </li>
  );
};

const PhoneLink = ({ title, url, className }: { title: string; url: string; className?: string }) => {
  return (
    <li className="mb-0 py-1 list-disc ml-3">
      <Link
        href={url}
        className={clsx(
          "transition-all delay-75 pb-1 border-b-transparent border-b-2 hover:border-b-white",
          className
        )}
      >
        {title}
      </Link>
    </li>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#2B2B2B] text-white pt-20 pb-25 mt-8">
      <Container className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-25 justify-between ">
        <div>
          <Image
            src="/nutva-logo.png"
            alt="logo"
            width={0}
            height={0}
            className="inline-block mr-2 w-[200px] lg:h-[50px] md:h-[60px] mb-10"
          />
          <p className="text-white text-sm md:text-base md:leading-relaxed">
            NUTVA Complex - это натуральный и экологически чистый продукт высокого качества, созданный из трав Средней Азии и Европы по рецептам народной медицины.
          </p>
        </div>

        <div>
          <h4 className="text-2xl font-bold text-white mb-10">Контакты</h4>
          <ul className="mt-4 text-white text-sm md:text-base md:leading-relaxed">

            <li className="mb-3">
              Колл-центр:
              <ul className="text-white text-sm md:text-base md:leading-relaxed ml-5">
                <PhoneLink title="1294" url="tel:1294" />
                <PhoneLink title="+998 71 211-11-12" url="tel:+998 71 211-11-12" />
              </ul>
            </li>

            <li className="mb-3">Эл. адрес: {" "}
              <Link
                className="border-b-1 border-white"
                href="mailto:info@nutva.uz">
                info@nutva.uz
              </Link>
            </li>

            <li className="mb-3">Адрес:  Узбекистан, Ташкент</li>

            <li>
              По вопросом сотрудничества:
              <ul className="text-white text-sm md:text-base md:leading-relaxed ml-5">
                <PhoneLink title="+998 95 185-10-01" url="tel:+998 95 185-10-01" />
                <PhoneLink title="info@nutva.uz" url="mailto:info@nutva.uz" />
              </ul>
            </li>

          </ul>
        </div>

        <div>
          <h4 className="text-2xl font-bold text-white mb-10">Быстрые ссылки</h4>
          <ul>
            {FooterLinks.map((link) => (
              <FooterLink key={link.title} title={link.title} url={link.url} />
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-2xl font-bold text-white mb-10">Социальные сети</h4>
          <ul>
            {SocialLinks.map((link) => (
              <FooterLink key={link.title} title={link.title} url={link.url} className="" />
            ))}
          </ul>
        </div>

      </Container>
    </footer>
  )
}

export default Footer;