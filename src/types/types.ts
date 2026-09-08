// PLANS TYPES

export type PlanBenefit = {
  name: string;
};

export type PlanProvider = {
  id: string;
  name: string;
  website: string;
  logo_url: string | null;
  description: string | null;
};

export type PlanResult = {
  id: string;
  provider_id: string;

  name: string;
  price: number;

  download_speed: number;
  upload_speed: number;

  description: string | null;

  promotional_price: number | null;
  promotional_months: number | null;

  benefits: PlanBenefit[];

  installation_fee: number | null;
  contract_months: number | null;

  is_active: boolean;

  wifi_type: string | null;

  source_url: string;

  provider: PlanProvider | null;

  coverageStatus: "available" | "unknown" | null;
};

export type PlanResultCardProps = {
  plan: PlanResult;
};

// PROVIDERS TYPES
export type ProviderGroup = {
  provider: NonNullable<PlanResult["provider"]>;
  plans: PlanResult[];
  coverageStatus: "available" | "unknown" | null;
};

// PAGESEO TYPES

export interface PageSEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

// PROVIDERS COVERAGE E NEIGHBORHOODS TYPES

export type SelectedNeighborhood = {
  id: string;
  name: string;
};

export type Neighborhood = {
  id: string;
  name: string;
};
