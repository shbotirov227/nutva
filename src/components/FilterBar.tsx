"use client";

// import { useState } from "react";
import { Search, CheckCircle, ChartNoAxesCombined } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "./DatePicker";
import clsx from "clsx";


interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedCats: string[];
  setSelectedCats: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FilterBar({
  search,
  setSearch,
  selectedDate,
  setSelectedDate,
  selectedCats,
  setSelectedCats,
}: FilterBarProps) {
  
  const { t } = useTranslation();

  const categories = [
    { id: "most-popular", label: t("blog.mostViews"), icon: <CheckCircle size={16} /> },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCats((prev: string[]) =>
      prev.includes(id) ? prev.filter((c: string) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex items-center gap-4 mb-8">

      <div className="w-[30%] relative">
        <Input
          placeholder={t("blog.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xl bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-4 pr-3 py-6 rounded-md shadow-sm text-semibold"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      <div className="flex justify-between gap-2">
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder={t("blog.date")}
          className="max-w-1/2"
        />

        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-6 rounded-md border transition-all cursor-pointer text-semibold",
              selectedCats.includes(cat.id)
                ? "bg-green-600 text-white border-green-700"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            )}
          >
            <ChartNoAxesCombined size={16} />
            <span className="text-sm">{cat.label}</span>
          </Button>
        ))}
      </div>

      <Button
        onClick={() => {
          setSearch("");
          setSelectedDate(undefined);
          setSelectedCats([]);
        }}
        variant="default"
        color="gray"
        disabled={!search && !selectedDate && selectedCats.length === 0}
        className={clsx(
          !search && !selectedDate && selectedCats.length === 0 ? "hidden" : "",
          "px-3 py-6 !text-white rounded-md border transition-all cursor-pointer text-semibold col-span-2 md:col-span-1"
        )}
      >
        {t("blog.clearFilter")}
      </Button>

    </div>
  );
}
