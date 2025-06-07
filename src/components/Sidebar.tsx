'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // yoki `classnames` kutubxonasi ishlatishingiz mumkin
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
// import { logout } from "@/api/auth/logout";
import { Button } from "./ui/button";

const links = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Blogs', href: '/admin/blogs' },
    { name: 'Monitoring', href: '/admin/monitoring' },
    { name: 'Settings', href: '/admin/settings' },
    { name: 'Profile', href: '/admin/profile' },
    { name: 'Site', href: '/' },
];

export default function Sidebar() {

    const { data: session, status } = useSession();

    // console.log('Session:', session);

    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r h-full p-4">
            <div className="mb-6 flex items-center justify-between">
                <Image
                    className="inline-block"
                    src="/header-nutva-logo.png"
                    alt="logo"
                    width={87}
                    height={87}
                />
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <nav className="space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                            'block px-4 py-2 rounded hover:bg-gray-200 transition',
                            pathname === link.href ? 'bg-gray-200 font-semibold' : ''
                        )}
                    >
                        {link.name}
                    </Link>
                ))}
                {/* <Button className="w-full mt-4" onClick={() => logout(session?.user?.token)}>Logout</Button> */}
                <Button className="w-full mt-4 cursor-pointer" disabled={status === 'loading'} onClick={() => signOut({ callbackUrl: "/login" })}>Logout</Button>
            </nav>
        </aside>
    );
}
