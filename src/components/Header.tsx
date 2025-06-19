"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Container from "./Container";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
    return (
        <Link
            href={href}
            className="text-white px-4 text-xl transition-all delay-75 pb-2 border-b-transparent border-b-2 hover:border-b-white"
        >
            {children}
        </Link>
    );
};

const Header: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 0) {
                setVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                setVisible(false);
            } else if (currentScrollY < lastScrollY.current) {
                setVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className="max-w-[375px]:border-red-600 sm:w-full sm:h-[80px] sm:border-red-500 fixed top-0 w-full box-border text-white py-7 shadow-md backdrop-blur-xl z-50 transition-transform duration-300"
            style={{
                backgroundColor: `rgba(20, 20, 20, 0.7)`,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
                transform: visible ? "translateY(0)" : "translateY(-100%)",

            }}
        >
            <Container>
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src="/nutva-logo.png" alt="Logo" width={150} height={150} className="inline-block mr-2" />
                    </Link>
                    <nav className="mt-2">
                        <ul className=" flex space-x-5">
                            <li><NavLink href="/">Главная</NavLink></li>
                            <li><NavLink href="/product">Продукты</NavLink></li>
                            <li><NavLink href="/about-us">О бренде</NavLink></li>
                            <li><NavLink href="/blog">Блог</NavLink></li>
                            <li><NavLink href="/contact">Контакты</NavLink></li>
                            <li><NavLink href="/admin">Admin</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </Container>
        </header>
    );
};

export default Header;
