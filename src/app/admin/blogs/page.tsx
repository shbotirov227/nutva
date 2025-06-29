'use client';

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { apiClient } from "@/api/requests";
// import { toast } from "react-toastify";
// import { useCreateBlog } from "@/lib/api-hooks";
import { toast } from "react-toastify";
// import { CreateBlogType } from "@/types/blogs/createBlog";
import { useSession } from "next-auth/react";
// import { getToken } from "next-auth/jwt";

export default function BlogsPage() {
    //   const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [slug, setSlug] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");
    const [images, setImages] = useState<FileList | null>(null);
    const { data: session } = useSession();
    // const [blogs, setBlogs] = useState<CreateBlogType>();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("slug", slug);
        formData.append("metaTitle", metaTitle);
        formData.append("metaDescription", metaDescription);
        formData.append("metaKeywords", metaKeywords);
        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        }

        const response = await fetch("/api/Blog", {
            method: "POST",
            headers: {
                // "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${session?.user?.token}`,
            },
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            toast.error(`Xatolik: ${errorData.message || "Blog yaratishda xatolik"}`);
            return;
        }

        const data = await response.json();
        toast.success("Blog muvaffaqiyatli yaratildi!", {
            position: "top-right",
            autoClose: 5000,
        });
        console.log("Blog yaratildi:", data);
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Yangi blog yaratish</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                }}
                className="space-y-4"
            >
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} required />
                </div>

                <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                </div>

                <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} />
                </div>

                <div>
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input id="metaKeywords" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="images">Images</Label>
                    <Input id="images" type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
                </div>

                <Button type="submit" className="w-full cursor-pointer">
                    {/* {isPending ? "Yuklanmoqda..." : "Blogni yaratish"} */}
                    Blog yaratish
                </Button>
            </form>
        </div>
    );
}
