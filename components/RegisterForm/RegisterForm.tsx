"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppForm from "../forms/useAppForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import z from "zod";

export const registerSchema = z
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
    console.log(data);
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

export function RegisterForm() {
  const [currentTab, setCurrentTab] = useState<"basicInfo" | "subscription">(
    "basicInfo"
  );
  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <Card className="w-full min-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Registro de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={currentTab}
            onValueChange={(value) =>
              setCurrentTab(value as "basicInfo" | "subscription")
            }
          >
            <TabsList>
              <TabsTrigger value="basicInfo">Información Básica</TabsTrigger>
              <TabsTrigger value="subscription">Suscripción</TabsTrigger>
            </TabsList>
            <TabsContent value="basicInfo" className="space-y-4 pt-4">
              <form.AppField
                name="fullName"
                validators={{ onChange: registerSchema.shape.fullName }}
              >
                {(field) => (
                  <field.TextInput
                    label="Nombre Completo"
                    placeholder="Ingresa tu nombre completo"
                  />
                )}
              </form.AppField>
              <form.AppField
                name="email"
                validators={{ onChange: registerSchema.shape.email }}
              >
                {(field) => (
                  <field.TextInput
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                  />
                )}
              </form.AppField>

              <form.AppField
                name="password"
                validators={{ onChange: registerSchema.shape.password }}
              >
                {(field) => (
                  <field.TextInput
                    label="Contraseña"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                  />
                )}
              </form.AppField>

              <form.AppField
                name="confirmPassword"
                validators={{
                  onChange: registerSchema.shape.confirmPassword,
                }}
              >
                {(field) => (
                  <field.TextInput
                    label="Confirmar Contraseña"
                    type="password"
                    placeholder="Confirma tu contraseña"
                  />
                )}
              </form.AppField>
            </TabsContent>
            <TabsContent value="subscription" className="space-y-6 pt-4">
              {/* Subscription section */}
            </TabsContent>
          </Tabs>
          <div className="flex justify-end pt-4">
            <form.AppForm>
              <form.SubmitButton>Registrar Usuario</form.SubmitButton>
            </form.AppForm>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
