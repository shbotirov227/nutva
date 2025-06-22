"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function ContactPage() {
	const [form, setForm] = useState({ name: "", phone: "", message: "" });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Bu yerda emailga yuborish yoki serverga so‘rov yuborish bo‘lishi mumkin
		console.log("Yuborildi:", form);
		alert("Сообщение отправлено!");
		setForm({ name: "", phone: "", message: "" });
	};

	return (
		<section className="bg-[#BEE1B5] py-32 px-4">
			<div className="max-w-5xl mx-auto text-center mb-10 px-4">
				<h2 className="text-3xl md:text-4xl font-bold text-[#1A3929] mb-4">Связаться с нами</h2>
				<p className="text-[#1A3929] text-base md:text-lg">
					Будем рады ответить на все ваши вопросы о наших продуктах и услугах.
				</p>
			</div>

			<Card className="max-w-2xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FDF6F2] rounded-xl">

				{/* Forma bo‘limi */}
				<form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
					<div className="flex flex-col md:flex-row gap-4">
						<Input
							name="name"
							placeholder="Ваше имя"
							value={form.name}
							onChange={handleChange}
							required
							className="bg-white w-full"
						/>
						<Input
							name="phone"
							placeholder="Ваш телефон"
							value={form.phone}
							onChange={handleChange}
							required
							className="bg-white w-full"
						/>
					</div>

					<Textarea
						name="message"
						placeholder="Тема обращения"
						value={form.message}
						onChange={handleChange}
						required
						className="bg-white resize-none w-full"
					/>

					<Button
						type="submit"
						className="bg-[#267A41] hover:bg-[#1F6335] text-white w-full md:w-auto"
					>
						Отправить с общение
					</Button>
				</form>

				{/* Kontakt ma’lumotlar */}
				<div className="text-left space-y-4 text-[#1A3929]">
					<div>
						<p className="font-semibold mb-1 text-[#164A24]">📞 Телефон:</p>
						<p className="text-sm font-light text-[#164A24]">+998 71 211-11-12</p>
						<p className="mt-2 text-sm text-[#164A24]">1294</p>
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