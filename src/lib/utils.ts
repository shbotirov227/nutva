import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const formatPhoneNumber = (value: string): string => {
//   const digits = value.replace(/\D/g, "").slice(0, 12);
//   const match = digits.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);

//   if (match) {
//     return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
//   }

//   return "+" + digits;
// };
