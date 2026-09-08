import type { ProviderGroup } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractPathFromUrl(url: string) {
  const parts = url.split("/");
  return parts.slice(-2).join("/");
}

export const getPlanPrice = (plan: ProviderGroup["plans"][number]) => {
  if (plan.promotional_price !== null && plan.promotional_months !== null) {
    return plan.promotional_price;
  }

  return plan.price;
};

export const getCoveragePriority = (status: ProviderGroup["coverageStatus"]) => {
  switch (status) {
    case "available":
      return 0;

    case "unknown":
      return 1;

    default:
      return 2;
  }
};
