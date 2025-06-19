import { useState } from "react";
import { CalendarDays, Search, CheckCircle, ChartNoAxesCombined } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "./DatePicker";

const categories = [
  { id: "most-popular", label: "Most views", icon: <CheckCircle size={16} /> },
];

export default function FilterBar() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="w-full relative">
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Date"
        />
        <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      <div className="w-full relative">
        <Input
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md border transition-all",
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
    </div>
  );
}
