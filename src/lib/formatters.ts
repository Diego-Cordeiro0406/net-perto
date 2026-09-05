export function formatZipCode(zipCode: string) {
  const cleanZipCode = zipCode.replace(/\D/g, "");

  if (cleanZipCode.length <= 5) {
    return cleanZipCode;
  }

  return cleanZipCode.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
}

export const formatCurrency = (value: number) => {
  if (value === null) {
    return null;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
