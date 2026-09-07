import type { PlanResult } from "@/types/types";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type AnalyticsEventData = Record<string, unknown>;

function pushEvent(event: string, data: AnalyticsEventData = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];

  window.dataLayer.push({
    event,
    ...data,
  });
}

export function trackSearch(neighborhood: { id: string; name: string }) {
  pushEvent("search_neighborhood", {
    neighborhood_id: neighborhood.id,
    neighborhood_name: neighborhood.name,
  });
}
export function trackSortChange(sortBy: string) {
  pushEvent("change_sort", {
    sort_by: sortBy,
  });
}

export function trackProviderWebsiteClick(provider: { id: string; name: string }) {
  pushEvent("provider_website_click", {
    provider_id: provider.id,
    provider_name: provider.name,
  });
}

export function trackPlanOfferClick(plan: PlanResult) {
  pushEvent("plan_offer_click", {
    plan_id: plan.id,
    plan_name: plan.name,

    provider_id: plan.provider_id,
    provider_name: plan.provider?.name ?? null,

    price: plan.price,
    promotional_price: plan.promotional_price,

    download_speed: plan.download_speed,
    upload_speed: plan.upload_speed,
  });
}

export function trackNoResults(neighborhood?: { id: string; name: string }) {
  pushEvent("search_no_results", {
    neighborhood_id: neighborhood?.id ?? null,
    neighborhood_name: neighborhood?.name ?? null,
  });
}

export function trackSearchError(errorMessage?: string) {
  pushEvent("search_error", {
    error_message: errorMessage ?? null,
  });
}
