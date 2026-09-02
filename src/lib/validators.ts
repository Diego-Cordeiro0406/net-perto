import { z } from "zod";

export const searchSchema = z.object({
  zipCode: z
    .string()
    .min(1, "Digite seu CEP")
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 8, {
      message: "Digite um CEP válido",
    }),
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
  zip_code: z
    .string()
    .min(1, "Informe o CEP.")
    .regex(/^\d{5}-?\d{3}$/, "Informe um CEP válido."),

  street: z.string(),

  neighborhood: z.string(),

  status: z.string().min(1, "Selecione o status."),

  source: z.string().min(1, "Informe a fonte."),

  last_checked_at: z.string().optional(),
});

export type ProviderCoverageFormData = z.infer<typeof providerCoverageSchema>;
