"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function ContactPage() {
	const [form, setForm] = useState({ name: "", phone: "", message: "" });
	const [loading, setLoading] = useState(false);

	// Input maydonlar o'zgarishini kuzatuvchi funksiya
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Formani yuborish funksiyasi
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch("/api/contact-forms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: form.name,
					phone: form.phone,
					comment: form.message,
				}),
			});

			if (!response.ok) throw new Error("Server xatosi");

			alert("Xabar muvaffaqiyatli yuborildi!");
			setForm({ name: "", phone: "", message: "" });
		} catch (error) {
			console.error("Xatolik:", error);
			alert("Xabarni yuborishda xatolik yuz berdi.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="bg-[#BEE1B5] py-32 px-4">
			<div className="max-w-5xl mx-auto text-center mb-10 px-4">
				<h2 className="text-3xl md:text-4xl font-bold text-[#1A3929] mb-4">Biz bilan bog‘laning</h2>
				<p className="text-[#1A3929] text-base md:text-lg">
					Mahsulot va xizmatlarimiz bo‘yicha savollaringizga javob berishdan mamnunmiz.
				</p>
			</div>

			<Card className="max-w-2xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FDF6F2] rounded-xl">
				{/* Forma qismi */}
				<form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
					<div className="flex flex-col md:flex-row gap-4">
						<Input
							name="name"
							placeholder="Ismingiz"
							value={form.name}
							onChange={handleChange}
							required
							className="bg-white w-full"
						/>
						<Input
							name="phone"
							placeholder="Telefon raqamingiz"
							value={form.phone}
							onChange={handleChange}
							required
							className="bg-white w-full"
						/>
					</div>

					<Textarea
						name="message"
						placeholder="Xabaringiz mavzusi"
						value={form.message}
						onChange={handleChange}
						required
						className="bg-white resize-none w-full"
					/>

					<Button
						type="submit"
						className="bg-[#267A41] hover:bg-[#1F6335] text-white w-full md:w-auto"
						disabled={loading}
					>
						{loading ? "Yuborilmoqda..." : "Xabarni yuborish"}
					</Button>
				</form>

				{/* Kontakt ma’lumotlar qismi */}
				<div className="text-left space-y-4 text-[#1A3929]">
					<div>
						<p className="font-semibold mb-1 text-[#164A24]">📞 Telefon:</p>
						<p className="text-sm font-light text-[#164A24]">+998 71 211-11-12</p>
						<p className="mt-2 text-sm text-[#164A24]">1294 (qisqa raqam)</p>
					</div>
					<div>
						<p className="font-semibold mb-1 text-[#164A24]">📧 Email:</p>
						<p className="text-sm text-[#164A24]">info@nutva.uz</p>
					</div>
				</div>
			</Card>
		</section>
	);
}
