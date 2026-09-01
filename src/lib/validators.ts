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
  email: z
    .email("Digite um e-mail válido")
    .min(1, "Digite seu e-mail"),

  password: z
    .string()
    .min(1, "Digite sua senha"),
});

export type LoginFormData = z.infer<typeof loginSchema>;