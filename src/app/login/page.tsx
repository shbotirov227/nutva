// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";
// import AdminPage from "../admin/page";

export default function Login() {
	// const [authenticated, setAuthenticated] = useState(false);
	// const { data: session, status } = useSession();
	// const router = useRouter();

	// useEffect(() => {
	// 	if (status === "authenticated") {
	// 		router.push("/admin");
	// 	}
	// }, [status, router]);

	// if (status === "loading") {
	// 	return <div className="h-screen flex items-center justify-center">Yuklanmoqda...</div>;
	// }

	// console.log("Login Page Session data:", session);

	return (
		<main className="min-h-screen flex items-center justify-center">
			{/* {authenticated ? ( */}
				{/* <AdminPage /> */}
			{/* ) : ( */}
				<AuthForm />
			{/* )} */}
		</main>
	);
}