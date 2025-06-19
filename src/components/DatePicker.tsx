"use client"

import { CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { formatDate } from "@/lib/formatDate";

interface DatePickerProps {
  value?: Date | undefined;
  setValue?: (date: Date | undefined) => void;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
}

const DatePicker = ({ value, setValue, placeholder }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white cursor-pointer text-sm text-gray-700 hover:bg-gray-100 shadow-sm"
        >
          <CalendarIcon className="w-4 h-4 text-gray-500" />
          <span>{value ? formatDate(value) : placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={setValue}
          captionLayout="dropdown"
          className="rounded-md shadow-lg"
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
