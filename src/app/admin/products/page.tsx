"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/apiClient";
import { Label } from "@radix-ui/react-label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";
import { title } from "process";
import { useState } from "react";
import { toast } from "react-toastify";

// import AddProductForm from "@/components/forms/AddProductForm";
import { CreateProductType } from "@/types/products/createProduct";

export default function ProductsPage() {

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [slug, setSlug] = useState("");
	const [price, setPrice] = useState(0);
	const [metaTitle, setMetaTitle] = useState("");
	const [metaDescription, setMetaDescription] = useState("");
	const [metaKeywords, setMetaKeywords] = useState("");
	const [images, setImages] = useState<FileList | string[] | null>(null);
	const { data: session } = useSession();

	async function getS() {
		const session = await getSession();
		return session;
		console.log("Get Session", session)
	}

	getS()


	const queryClient = useQueryClient();

	const { mutate: createProduct, isLoading, isError, isSuccess } = useMutation({
		mutationFn: (data: CreateProductType) => {
			if (!session || !session.user?.token) {
				throw new Error("User session or token is missing");
			}
			return apiClient.createProduct(data, session.user.token);
		},
		onSuccess: (data) => {
			toast.success(`Product created: ${data.title} ${isSuccess}`, {
				position: "top-right",
				autoClose: 5000,
			});
			// Istasangiz product listni invalidatsiya qilsangiz ham bo'ladi:
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (error) => {
			toast.error(`Error creating product: ${error} ${isError}`, {
				position: "top-right",
				autoClose: 5000,
			});
		},
		// onSettled: () => {
		//     setName("");
		//     setDescription("");
		//     setSlug("");
		//     setPrice(0);
		//     setMetaTitle("");
		//     setMetaDescription("");
		//     setMetaKeywords("");
		//     setImages(null);
		// },
	});

	// const handleSubmit = async (e: React.FormEvent) => {
	//     e.preventDefault();

	//     const formData = new FormData();
	//     formData.append("title", title);
	//     formData.append("content", content);
	//     formData.append("slug", slug);
	//     formData.append("metaTitle", metaTitle);
	//     formData.append("metaDescription", metaDescription);
	//     formData.append("metaKeywords", metaKeywords);
	//     if (images) {
	//         for (let i = 0; i < images.length; i++) {
	//             formData.append("images", images[i]);
	//         }
	//     }

	//     const response = await fetch("/api/Blog", {
	//         method: "POST",
	//         headers: {
	//             // "Content-Type": "multipart/form-data",
	//             "Authorization": `Bearer ${session?.user?.token}`,
	//         },
	//         body: formData,
	//     });
	//     if (!response.ok) {
	//         const errorData = await response.json();
	//         toast.error(`Xatolik: ${errorData.message || "Blog yaratishda xatolik"}`);
	//         return;
	//     }

	//     const data = await response.json();
	//     toast.success("Blog muvaffaqiyatli yaratildi!");
	//     console.log("Blog yaratildi:", data);
	// }


	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		createProduct({
			name,
			description,
			price,
			slug,
			metaTitle,
			metaDescription,
			metaKeywords,
			imageUrls: images,
		});
	}

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold mb-10">Yangi mahsulot qo‘shish</h1>
			{/* <AddProductForm /> */}
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				<div>
					<Label htmlFor="title">Name</Label>
					<Input
						id="title"
						name="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						name="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)} rows={5}
						required
					/>
				</div>

				<div>
					<Label htmlFor="price">Price</Label>
					<Input
						id="price"
						name="Price"
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.valueAsNumber)}
						required
					/>
				</div>

				<div>
					<Label htmlFor="slug">Slug</Label>
					<Input
						id="slug"
						name="Slug"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						required
					/>
				</div>

				<div>
					<Label htmlFor="metaTitle">Meta Title</Label>
					<Input
						id="metaTitle"
						name="MetaTitle"
						value={metaTitle}
						onChange={(e) => setMetaTitle(e.target.value)}
					/>
				</div>

				<div>
					<Label htmlFor="metaDescription">Meta Description</Label>
					<Textarea
						id="metaDescription"
						name="MetaDescription"
						value={metaDescription}
						onChange={(e) => setMetaDescription(e.target.value)}
						rows={2}
					/>
				</div>

				<div>
					<Label htmlFor="metaKeywords">Meta Keywords</Label>
					<Input
						id="metaKeywords"
						name="MetaKeywords"
						value={metaKeywords}
						onChange={(e) => setMetaKeywords(e.target.value)}
					/>
				</div>

				<div>
					<Label htmlFor="images">Images</Label>
					<Input
						id="images"
						name="Images"
						type="file"
						multiple
						accept="image/*"
						onChange={(e) => setImages(e.target.files)}
					/>
				</div>

				<Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
					{isLoading ? "Yuklanmoqda..." : "Blogni yaratish"}
				</Button>
			</form>
		</div>
	);
}
