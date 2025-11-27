"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Snowfall from "./Snowfall";

const Layout = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();

	const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/login");
	const isTaplinksRoute = pathname.startsWith("/taplinks");

	return (
		<div className="flex flex-col min-h-screen">
			{/* New Year Snowfall Animation */}
			<Snowfall />

			{!isAdminRoute && !isTaplinksRoute && <Header />}

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

			{!isAdminRoute && !isTaplinksRoute && <Footer />}
		</div>
	);
};

export default Layout;
