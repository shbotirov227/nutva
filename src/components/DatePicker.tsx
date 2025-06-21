"use client"

import { CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { formatDate } from "@/lib/formatDate";
import clsx from "clsx";

interface DatePickerProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const DatePicker = ({ value, onChange, placeholder, className }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger className="w-full" asChild>
        <button
          className={clsx(
            "flex items-center gap-2 px-4 py-2 border rounded-md bg-white cursor-pointer text-sm text-gray-700 hover:bg-gray-100 shadow-sm",
            className
          )}
        >
          <CalendarIcon className="w-4 h-4 text-gray-500" />
          <span>{value ? formatDate(value) : placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          captionLayout="dropdown"
          className="rounded-md shadow-lg"
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
