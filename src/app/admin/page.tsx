"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return <div className="h-screen flex items-center justify-center">Yuklanmoqda...</div>;
	}

	return (
		<main>
			<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
			<p>Xush kelibsiz, {session?.user?.name}</p>
		</main>
	)
}
