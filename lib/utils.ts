import { type ClassValue, clsx } from "clsx";

// Lightweight class merge utility (no dependency needed for Tailwind v4)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
