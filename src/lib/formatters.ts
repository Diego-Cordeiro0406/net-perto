export function formatZipCode(zipCode: string) {
  return zipCode.replace(/^(\d{5})(\d{3})$/, "$1-$2");
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
