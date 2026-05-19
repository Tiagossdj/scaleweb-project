import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEmergy(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)} E12 seJ`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)} E9 seJ`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)} E6 seJ`;
  return `${value.toExponential(2)} seJ`;
}
