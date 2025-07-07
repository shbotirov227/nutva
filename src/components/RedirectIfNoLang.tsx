"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/context/LangContext";

type Props = {
  langFromUrl?: string;
  id: string;
};

export default function RedirectIfNoLang({ langFromUrl, id }: Props) {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!langFromUrl) {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("lang", lang);

      router.replace(`/blog/${id}?${currentParams.toString()}`);
    }
  }, [langFromUrl, lang, id, searchParams, router]);

  return null;
}
