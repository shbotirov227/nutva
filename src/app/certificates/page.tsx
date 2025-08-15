"use client";
import { useMemo, useState } from "react";
import Container from "@/components/Container";
import { CertificateCard } from "@/app/certificates/components/CertificateCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck } from "lucide-react";
import type { StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";

const PDF1 = "/certificates/sertifikat.pdf";
const PDF2 = "/certificates/nutva_resheniya.pdf";
const PDF3 = "/certificates/zaklucheniya.pdf";
const PDF4 = "/certificates/NUTVA_PHARM_LLC_HALAL_UKCERT.pdf";
const PDF5 = "/certificates/nutva_pharm_llc_iso_9001_2015.pdf";
const PDF6 = "/certificates/nutva_pharm_llc_iso_22000_2018.pdf";

type Cert = {
  id: number;
  title: string;
  description: string;
  image: StaticImageData | string;
  category: string;
  validUntil: string;
  issuer: string;
};

const CERTIFICATES: Cert[] = [
  {
    id: 1,
    title: "Сертификат соответствия — Nutva Pharm",
    description: "Официальное подтверждение соответствия продукции Nutva Pharm.",
    image: PDF1,
    category: "Документация",
    validUntil: "—",
    issuer: "Certification Body",
  },
  {
    id: 2,
    title: "Разрешение на реализацию",
    description: "Документ, разрешающий производство/реализацию продукции.",
    image: PDF2,
    category: "Разрешение",
    validUntil: "—",
    issuer: "Компетентный орган",
  },
  {
    id: 3,
    title: "Заключение СЭС",
    description: "Санитарно-эпидемиологическое заключение.",
    image: PDF3,
    category: "Документация",
    validUntil: "—",
    issuer: "СЭС",
  },
  {
    id: 4,
    title: "Halal Certificate — Nutva Pharm",
    description: "Halal certification for Nutva Pharm products.",
    image: PDF4,
    category: "Halal",
    validUntil: "—",
    issuer: "Certification Body",
  },
  {
    id: 5,
    title: "ISO 9001:2015 — Nutva Pharm",
    description: "ISO 9001:2015 certificate (Quality Management System).",
    image: PDF5,
    category: "Halal",
    validUntil: "—",
    issuer: "Certification Body",
  },
  {
    id: 6,
    title: "ISO 22000:2018 — Nutva Pharm",
    description: "ISO 22000:2018 certificate (Food Safety Management System).",
    image: PDF6,
    category: "Halal",
    validUntil: "—",
    issuer: "Certification Body",
  },
];

const CATEGORIES = ["Все", ...Array.from(new Set(CERTIFICATES.map((c) => c.category)))] as const;

export default function CertificatesPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Все");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CERTIFICATES.filter((c) => {
      const matchesQ = !q || [c.title, c.description, c.issuer, c.category]
        .join(" ")
        .toLowerCase()
        .includes(q);
      const matchesCat = category === "Все" || c.category === category;
      return matchesQ && matchesCat;
    });
  }, [query, category]);

  return (
    <div className="relative pt-24 md:pt-28 pb-12 md:pb-20 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-white to-white" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[800px] bg-[#51FFAE]/20 blur-3xl rounded-full opacity-50 pointer-events-none" />

      <Container>
        {/* Hero header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            {t("certificates.badge")}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {t("certificates.heroTitle")}
          </h1>
          <p className="mt-4 text-slate-600">
            {t("certificates.heroSubtitle")}
          </p>
        </div>

        {/* Search + filters */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("certificates.searchPlaceholder") as string}
              className="pl-10 h-12 text-base placeholder:text-slate-500 dark:placeholder:text-slate-500 border-slate-200 dark:border-slate-700 focus:border-slate-300 dark:focus:border-slate-600 bg-white dark:bg-slate-900 focus:ring-0"
            />
          </div>

          <Tabs value={category} onValueChange={(v) => setCategory(v as (typeof CATEGORIES)[number])} className="w-full sm:w-auto">
            <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
              {CATEGORIES.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-slate-900 data-[state=active]:text-white cursor-pointer transition-all duration-300">
                  {cat === "Все"
                    ? t("certificates.categories.all")
                    : cat === "Документация"
                    ? t("certificates.categories.documentation")
                    : cat === "Разрешение"
                    ? t("certificates.categories.permission")
                    : cat === "Halal"
                    ? t("certificates.categories.halal")
                    : cat}
                </TabsTrigger>
              ))}
            </TabsList>
            {CATEGORIES.map((cat) => (
              <TabsContent key={cat} value={cat} />
            ))}
          </Tabs>
        </div>

        {/* Results meta */}
        <div className="mt-3 md:mt-4 text-sm text-slate-500 flex items-center gap-3">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
            {t("certificates.found", { count: filtered.length })}
          </Badge>
          {query && <span>{t("certificates.forQuery", { query })}</span>}
        </div>

        {/* Grid */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((c) => (
            <CertificateCard key={c.id} certificate={c} />
          ))}
        </div>
      </Container>
    </div>
  );
}
