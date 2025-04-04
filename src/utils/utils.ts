import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper for random data generation
export const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
