"use client";

import { Search, ChartNoAxesCombined, X, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "./DatePicker";
import { useState } from "react";

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
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "most-popular", label: t("blog.mostViews"), icon: <ChartNoAxesCombined size={16} /> },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCats((prev: string[]) =>
      prev.includes(id) ? prev.filter((c: string) => c !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedDate(undefined);
    setSelectedCats([]);
    setShowFilters(false);
  };

  const hasActiveFilters = search || selectedDate || selectedCats.length > 0;
  const activeFiltersCount = [search, selectedDate, selectedCats.length > 0].filter(Boolean).length;

  return (
    <>
      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-4 mb-8">
        {/* Search Bar - Always Visible */}
        <div className="relative">
          <Input
            placeholder={t("blog.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 pl-4 pr-12 rounded-lg shadow-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={cn(
              "h-12 px-4 rounded-lg border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200",
              showFilters && "border-emerald-500 bg-emerald-50"
            )}
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="font-medium">
              {t("common.filters")}
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </span>
          </Button>

          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="h-12 px-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              {t("common.clear")}
            </Button>
          )}
        </div>

        {/* Collapsible Filter Section */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("blog.filterByDate")}
              </label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder={t("blog.selectDate")}
                className="w-full h-11"
              />
            </div>

            {/* Category Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("blog.filterByCategory")}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    size="sm"
                    className={cn(
                      "h-10 px-3 rounded-full transition-all duration-200",
                      selectedCats.includes(cat.id)
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {cat.icon}
                    <span className="ml-1 text-sm">{cat.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            {/* Search Input */}
            <div className="flex-1 min-w-[320px] max-w-[450px] relative">
              <Input
                placeholder={t("blog.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 bg-gray-50 border-0 focus:border-2 focus:border-emerald-500 focus:ring-0 pl-5 pr-14 rounded-xl shadow-none font-medium text-gray-900 placeholder:text-gray-500"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Controls Group */}
            <div className="flex items-center gap-4">
              {/* Date Picker */}
              <div className="min-w-[180px]">
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder={t("blog.selectDate")}
                  className="h-14 px-5 rounded-xl border-0 bg-gray-50 font-medium text-gray-900 min-w-[180px] hover:bg-gray-100 transition-colors"
                />
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-3">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "h-14 px-6 rounded-xl border-0 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105",
                      selectedCats.includes(cat.id)
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <span className={cn(
                      "transition-colors",
                      selectedCats.includes(cat.id) ? "text-white" : "text-emerald-600"
                    )}>
                      {cat.icon}
                    </span>
                    <span className="ml-3">{cat.label}</span>
                  </Button>
                ))}
              </div>

              {/* Clear Button */}
              {hasActiveFilters && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="h-14 px-6 rounded-xl border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 font-semibold text-gray-600 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t("blog.clearFilter")}
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-medium text-gray-600">
                  Faol filtrlar:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {search && (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium">
                      Qidiruv: &ldquo;{search}&rdquo;
                    </span>
                  )}
                  {selectedDate && (
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      Sana: {selectedDate.toLocaleDateString('uz-UZ')}
                    </span>
                  )}
                  {selectedCats.map((catId) => {
                    const cat = categories.find(c => c.id === catId);
                    return cat ? (
                      <span key={catId} className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                        {cat.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
