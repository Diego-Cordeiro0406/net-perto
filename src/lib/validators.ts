import { z } from "zod";

export const searchSchema = z.object({
  neighborhoodId: z.string().min(1, "Selecione um bairro."),
});

export type SearchFormData = z.infer<typeof searchSchema>;

export const loginSchema = z.object({
  email: z.email("Digite um e-mail válido").min(1, "Digite seu e-mail"),

  password: z.string().min(1, "Digite sua senha"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const providerSchema = z.object({
  name: z
    .string()
    .min(1, "Digite o nome do provedor")
    .max(100, "O nome deve ter no máximo 100 caracteres"),

  website: z.url("Digite uma URL válida").min(1, "Digite o site do provedor"),

  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ProviderFormData = z.infer<typeof providerSchema>;

export const providerCoverageSchema = z.object({
  neighborhood_id: z.string().min(1, "Selecione um bairro."),

  status: z.string().min(1, "Selecione o status."),

  source: z.string().min(1, "Informe a fonte."),

  last_checked_at: z.string().optional(),
});

export type ProviderCoverageFormData = z.infer<typeof providerCoverageSchema>;

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null) {
    return undefined;
  }

  return value;
}, z.coerce.number().min(0).optional());

const optionalPositiveInteger = z.preprocess((value) => {
  if (value === "" || value === null) {
    return undefined;
  }

  return value;
}, z.coerce.number().int().min(1).optional());

const planBenefitSchema = z.object({
  name: z.string().min(1, "Informe o benefício."),
});

export const planSchema = z
  .object({
    name: z.string().min(1, "Informe o nome do plano."),

    description: z.string().optional(),

    price: z.coerce.number().min(0, "Informe um preço válido."),

    promotional_price: optionalNumber,

    promotional_months: optionalPositiveInteger,

    download_speed: z.coerce.number().int().min(1, "Informe a velocidade de download."),

    upload_speed: z.coerce.number().int().min(1, "Informe a velocidade de upload."),

    benefits: z.array(planBenefitSchema),

    installation_fee: z.coerce.number().min(0, "Informe uma taxa válida.").optional(),

    contract_months: z.coerce.number().int().min(1, "Informe uma quantidade válida.").optional(),

    source_url: z.url("Informe uma URL válida.").optional().or(z.literal("")),

    is_active: z.boolean(),

    wifi_type: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.promotional_price !== undefined && data.promotional_price !== null) {
        return data.promotional_months !== undefined;
      }

      return true;
    },
    {
      message: "Informe por quantos meses o preço promocional será válido.",
      path: ["promotional_months"],
    }
  );

export type PlanFormData = z.infer<typeof planSchema>;
