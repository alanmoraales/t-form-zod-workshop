"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppForm from "./forms/useAppForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { useState } from "react";
import { Badge } from "./ui/badge";

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
    mainAddress: z.object({
      address: z.string().min(1, "La dirección es requerida"),
      city: z.string().min(1, "La ciudad es requerida"),
      state: z.string().min(1, "El estado es requerido"),
      zipCode: z.string().min(1, "El código postal es requerido"),
    }),
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
  const [currentTab, setCurrentTab] = useState<"basicInfo" | "mainAddress">(
    "basicInfo"
  );
  const form = useAppForm({
    defaultValues: {
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
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const onSubmitBasicInfo = async () => {
    const fullNameValidationResult = await form.validateField(
      "fullName",
      "submit"
    );
    const emailValidationResult = await form.validateField("email", "submit");
    const passwordValidationResult = await form.validateField(
      "password",
      "submit"
    );
    const confirmPasswordValidationResult = await form.validateField(
      "confirmPassword",
      "submit"
    );
    const basicInfoValidationResult = [
      ...fullNameValidationResult,
      ...emailValidationResult,
      ...passwordValidationResult,
      ...confirmPasswordValidationResult,
    ];
    if (basicInfoValidationResult.length === 0) {
      setCurrentTab("mainAddress");
    }
  };

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
              setCurrentTab(value as "basicInfo" | "mainAddress")
            }
          >
            <TabsList>
              <form.Subscribe
                selector={(state) => {
                  const basicInfoFields = [
                    "fullName",
                    "email",
                    "password",
                    "confirmPassword",
                  ] as const;
                  const basicInfoFieldsErrorsCount = basicInfoFields.reduce(
                    (count, field) =>
                      count + (state.fieldMeta[field]?.isValid ? 0 : 1),
                    0
                  );
                  return [basicInfoFieldsErrorsCount];
                }}
              >
                {([basicInfoFieldsErrorsCount]) => (
                  <TabsTrigger value="basicInfo">
                    Información Básica{" "}
                    {basicInfoFieldsErrorsCount > 0 && (
                      <Badge variant="destructive">
                        {basicInfoFieldsErrorsCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
              </form.Subscribe>
              <TabsTrigger value="mainAddress">Dirección Principal</TabsTrigger>
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
                validators={{ onChange: registerSchema.shape.confirmPassword }}
              >
                {(field) => (
                  <field.TextInput
                    label="Confirmar Contraseña"
                    type="password"
                    placeholder="Confirma tu contraseña"
                  />
                )}
              </form.AppField>

              <div className="flex justify-end">
                <form.Subscribe
                  selector={(state) => {
                    const basicInfoFields = [
                      "fullName",
                      "email",
                      "password",
                      "confirmPassword",
                    ] as const;
                    const hasBasicInfoErrors = basicInfoFields.some(
                      (field) => !state.fieldMeta[field]?.isValid
                    );
                    return [hasBasicInfoErrors];
                  }}
                >
                  {([hasBasicInfoErrors]) => (
                    <Button
                      type="button"
                      onClick={onSubmitBasicInfo}
                      disabled={hasBasicInfoErrors}
                    >
                      Siguiente
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </TabsContent>
            <TabsContent value="mainAddress" className="space-y-4 pt-4">
              <form.AppField
                name="mainAddress.address"
                validators={{
                  onChange: registerSchema.shape.mainAddress.shape.address,
                }}
              >
                {(field) => <field.TextInput label="Dirección Principal" />}
              </form.AppField>
              <form.AppField
                name="mainAddress.city"
                validators={{
                  onChange: registerSchema.shape.mainAddress.shape.city,
                }}
              >
                {(field) => <field.TextInput label="Ciudad" />}
              </form.AppField>
              <form.AppField
                name="mainAddress.state"
                validators={{
                  onChange: registerSchema.shape.mainAddress.shape.state,
                }}
              >
                {(field) => <field.TextInput label="Estado" />}
              </form.AppField>
              <form.AppField
                name="mainAddress.zipCode"
                validators={{
                  onChange: registerSchema.shape.mainAddress.shape.zipCode,
                }}
              >
                {(field) => <field.TextInput label="Código Postal" />}
              </form.AppField>
              <div className="flex justify-end">
                <form.AppForm>
                  <form.SubmitButton>Registrar Usuario</form.SubmitButton>
                </form.AppForm>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  );
}
