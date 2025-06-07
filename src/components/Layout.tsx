'use client';

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();

	const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/login");

	return (
		<div className="flex flex-col min-h-screen">
			{!isAdminRoute && <Header />}

			<AnimatePresence mode="wait">
				<motion.main
					key={pathname}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3 }}
					className="flex-grow"
				>
					{children}
				</motion.main>
			</AnimatePresence>

			{!isAdminRoute && <Footer />}
		</div>
	);
};

export default Layout;
