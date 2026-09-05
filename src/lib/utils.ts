import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractPathFromUrl(url: string) {
  const parts = url.split("/");
  return parts.slice(-2).join("/");
}
