"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
// import { motion } from "framer-motion";
// import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
// import { login } from "@/api/login";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
// import router from "next/router";

export default function AuthForm(
    // { onLogin }: { onLogin: () => void }
) {
    const [form, setForm] = useState({ email: "", password: "" });
    const { status } = useSession();
    const router = useRouter();

    // const mutation = useMutation({
    // 	mutationFn: login,
    // 	onSuccess: (data) => {
    // 		toast.success("Login successful");
    // 		onLogin();
    // 	},
    // 	onError: (error: Error) => {
    // 		toast.error(error.message || "Login error");
    // 	},
    // });

    // const toggleMode = () => setIsLogin(!isLogin);

    // const handleSubmit = (e: React.FormEvent) => {
    // 	e.preventDefault();
    // 	mutation.mutate(form);
    // };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
            callbackUrl: "/admin",
        });


        if (res?.error) {
            toast.error("Login xato: " + res.error);
        } else if (res?.ok) {
            toast.success("Muvaffaqiyatli kirdingiz!");
            router.push( "/admin");
        }
    };

    return (
        // <motion.div
        // 	key={isLogin ? "login" : "signup"}
        // 	onSubmit={handleSubmit}
        // 	initial={{ y: 100, opacity: 0 }}
        // 	animate={{ y: 0, opacity: 1 }}
        // 	exit={{ y: -100, opacity: 0 }}
        // 	transition={{ duration: 0.3 }}
        // 	className="max-w-md w-full h-full mx-auto"
        // >
        <Card className="max-w-md w-full h-full mx-auto shadow-lg px-8 py-10">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    {/* {isLogin ? "Login" : "Signup"} */} Login
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            placeholder="user@example.com"
                            autoComplete="email"
                            className="w-full"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={form.password}
                            autoComplete="current-password"
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />

                        <Button
                            type="button"
                            variant="outline"
                            className="mt-2 w-full flex items-center justify-center gap-2"
                            onClick={() => {
                                const passwordInput = document.getElementById("password") as HTMLInputElement;
                                if (passwordInput) {
                                    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
                                }
                            }}
                        >
                            <Eye className="w-4 h-4" />
                            Show Password
                        </Button>
                    </div>
                    <Button type="submit" className="w-full" >
                        {/* {mutation.isPending
							? "Please wait..."
							: isLogin
								? "Login"
								: "Signup"} */}
                        Login
                    </Button>
                </form>

                <Button
                    variant="link"
                    className="mt-2 w-full text-blue-500 cursor-pointer transition-colors hover:text-blue-700"
                    disabled={status === "loading"}
                // onClick={toggleMode}
                >
                    {/* {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"} */}
                </Button>
            </CardContent>
        </Card>
        // </motion.div>
    );
}
