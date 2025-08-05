import {
  PaymentFrequency,
  SubscriptionType,
} from "@/server/subscriptions/types";
import z from "zod";

export const baseRegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  email: z.email("Debe ser un email válido").min(1, "El email es requerido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  confirmPassword: z.string(),
  mainAddress: z.object({
    address: z.string().min(1, "La dirección es requerida"),
    city: z.string().min(1, "La ciudad es requerida"),
    state: z.string().min(1, "El estado es requerido"),
    zipCode: z.string().min(1, "El código postal es requerido"),
  }),
});

export const freeSubscriptionRegisterSchema = baseRegisterSchema.extend({
  subscriptionType: z.literal(SubscriptionType.free),
  subscription: z
    .object({
      paymentFrequency: z.string(),
    })
    .transform(() => null),
});

export const premiumSubscriptionRegisterSchema = baseRegisterSchema.extend({
  subscriptionType: z.literal(SubscriptionType.premium),
  subscription: z.object({
    paymentFrequency: z.enum(
      [PaymentFrequency.monthly, PaymentFrequency.yearly],
      "La frecuencia de pago es requerida"
    ),
  }),
});

export const registerSchema = z
  .discriminatedUnion("subscriptionType", [
    freeSubscriptionRegisterSchema,
    premiumSubscriptionRegisterSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

export const defaultValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  mainAddress: {
    address: "",
    city: "",
    state: "",
    zipCode: "",
  },
  subscriptionType: SubscriptionType.free,
  subscription: {
    paymentFrequency: "",
  },
};
