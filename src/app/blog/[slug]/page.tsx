import Container from "@/components/Container";
import Image from "next/image";
import { notFound } from "next/navigation";

type BlogPost = {
	id: string;
	title: string;
	content: string;
	imageUrls: string[];
};

type Props = {
	params: {
		slug: string;
	};
};

export default async function BlogPostPage({ params }: Props) {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Blog/${params.slug}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			console.error("Error fetching blog post:", res.statusText);
			return notFound();
		}

		const post: BlogPost = await res.json();

		return (
			<Container className="pt-32">
				<div className="space-y-6">
					<h1 className="text-4xl font-bold">{post.title}</h1>

					{/* Barcha rasmni ko‘rsatish */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{post.imageUrls.map((img, index) => (
							<Image
								key={index}
								src={
									img.startsWith("http")
										? img
										: `https://www.nutvahealth.uz/uploads/${img}`
								}
								alt={`Blog Image ${index + 1}`}
								className="w-full max-h-[400px] object-cover rounded"
								width={500}
								height={300}
								loading="lazy"
							/>
						))}
					</div>

					<p className="text-lg whitespace-pre-line">{post.content}</p>
				</div>
			</Container>
		);
	} catch (error) {

		console.error("Error fetching blog post:", error);
	}
}
