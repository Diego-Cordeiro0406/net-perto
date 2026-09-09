export const COVERAGE_STATUS: Record<string, string> = {
  available: "Atendido",
  unavailable: "Não atendido",
  unknown: "Não confirmado",
};

export const SORT_LABELS = {
  price: "Menor preço",
  download: "Maior download",
  upload: "Maior upload",
} as const;

export const BASE_URL = "https://netperto.com.br";
