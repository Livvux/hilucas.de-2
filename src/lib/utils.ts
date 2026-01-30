import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared date formatter for consistent date display across components
export const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
