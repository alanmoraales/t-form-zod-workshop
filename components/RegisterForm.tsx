"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppForm from "./forms/useAppForm";

const registerSchema = z
  .object({
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
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

export function RegisterForm() {
  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }: { value: z.infer<typeof registerSchema> }) => {
      console.log(value);
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Registro de Usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.AppField name="fullName">
            {(field) => (
              <field.TextInput
                label="Nombre Completo"
                placeholder="Ingresa tu nombre completo"
              />
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <field.TextInput
                label="Email"
                type="email"
                placeholder="tu@email.com"
              />
            )}
          </form.AppField>

          <form.AppField name="password">
            {(field) => (
              <field.TextInput
                label="Contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
              />
            )}
          </form.AppField>

          <form.AppField name="confirmPassword">
            {(field) => (
              <field.TextInput
                label="Confirmar Contraseña"
                type="password"
                placeholder="Confirma tu contraseña"
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton>Registrar Usuario</form.SubmitButton>
          </form.AppForm>
        </form>
      </CardContent>
    </Card>
  );
}
