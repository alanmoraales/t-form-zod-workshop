"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppForm from "./forms/useAppForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { useState } from "react";
import { Badge } from "./ui/badge";
import {
  PaymentFrequency,
  SubscriptionType,
} from "@/server/subscriptions/types";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const baseRegisterSchema = z.object({
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

const freeSubscriptionRegisterSchema = baseRegisterSchema.extend({
  subscriptionType: z.literal(SubscriptionType.free),
  subscription: z
    .object({
      paymentFrequency: z.string(),
    })
    .transform(() => null),
});

const premiumSubscriptionRegisterSchema = baseRegisterSchema.extend({
  subscriptionType: z.literal(SubscriptionType.premium),
  subscription: z.object({
    paymentFrequency: z.enum(
      [PaymentFrequency.monthly, PaymentFrequency.yearly],
      "La frecuencia de pago es requerida"
    ),
  }),
});

const registerSchema = z
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

export function RegisterForm() {
  const [currentTab, setCurrentTab] = useState<
    "basicInfo" | "mainAddress" | "subscription"
  >("basicInfo");
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
      subscriptionType: SubscriptionType.free,
      subscription: {
        paymentFrequency: "",
      },
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const parsedValue = registerSchema.safeParse(value);
      console.log(parsedValue);
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

  const onSubmitMainAddress = async () => {
    const AddressValidationResult = await form.validateField(
      "mainAddress.address",
      "submit"
    );
    const cityValidationResult = await form.validateField(
      "mainAddress.city",
      "submit"
    );
    const stateValidationResult = await form.validateField(
      "mainAddress.state",
      "submit"
    );
    const zipCodeValidationResult = await form.validateField(
      "mainAddress.zipCode",
      "submit"
    );
    const mainAddressValidationResult = [
      ...AddressValidationResult,
      ...cityValidationResult,
      ...stateValidationResult,
      ...zipCodeValidationResult,
    ];
    if (mainAddressValidationResult.length === 0) {
      setCurrentTab("subscription");
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
                      count +
                      (state.fieldMeta[field]
                        ? state.fieldMeta[field]?.isValid
                          ? 0
                          : 1
                        : 0),
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
              <form.Subscribe
                selector={(state) => {
                  const mainAddressFields = [
                    "mainAddress.address",
                    "mainAddress.city",
                    "mainAddress.state",
                    "mainAddress.zipCode",
                  ] as const;
                  const mainAddressFieldsErrorsCount = mainAddressFields.reduce(
                    (count, field) =>
                      count +
                      (state.fieldMeta[field]
                        ? state.fieldMeta[field]?.isValid
                          ? 0
                          : 1
                        : 0),
                    0
                  );
                  return [mainAddressFieldsErrorsCount];
                }}
              >
                {([mainAddressFieldsErrorsCount]) => (
                  <TabsTrigger value="mainAddress">
                    Dirección Principal
                    {mainAddressFieldsErrorsCount > 0 && (
                      <Badge variant="destructive">
                        {mainAddressFieldsErrorsCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
              </form.Subscribe>
              <form.Subscribe
                selector={(state) => {
                  const subscriptionFields = [
                    "subscriptionType",
                    "subscription.paymentFrequency",
                  ] as const;
                  const subscriptionFieldsErrorsCount =
                    subscriptionFields.reduce(
                      (count, field) =>
                        count +
                        (state.fieldMeta[field]
                          ? state.fieldMeta[field]?.isValid
                            ? 0
                            : 1
                          : 0),
                      0
                    );
                  return [subscriptionFieldsErrorsCount];
                }}
              >
                {([subscriptionFieldsErrorsCount]) => (
                  <TabsTrigger value="subscription">
                    Suscripción
                    {subscriptionFieldsErrorsCount > 0 && (
                      <Badge variant="destructive">
                        {subscriptionFieldsErrorsCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
              </form.Subscribe>
            </TabsList>
            <TabsContent value="basicInfo" className="space-y-4 pt-4">
              <form.AppField
                name="fullName"
                validators={{ onChange: baseRegisterSchema.shape.fullName }}
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
                validators={{ onChange: baseRegisterSchema.shape.email }}
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
                validators={{ onChange: baseRegisterSchema.shape.password }}
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
                  onChange: baseRegisterSchema.shape.confirmPassword,
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
                  onChange: baseRegisterSchema.shape.mainAddress.shape.address,
                }}
              >
                {(field) => <field.TextInput label="Dirección Principal" />}
              </form.AppField>
              <form.AppField
                name="mainAddress.city"
                validators={{
                  onChange: baseRegisterSchema.shape.mainAddress.shape.city,
                }}
              >
                {(field) => <field.TextInput label="Ciudad" />}
              </form.AppField>
              <form.AppField
                name="mainAddress.state"
                validators={{
                  onChange: baseRegisterSchema.shape.mainAddress.shape.state,
                }}
              >
                {(field) => <field.TextInput label="Estado" />}
              </form.AppField>
              <form.AppField
                name="mainAddress.zipCode"
                validators={{
                  onChange: baseRegisterSchema.shape.mainAddress.shape.zipCode,
                }}
              >
                {(field) => <field.TextInput label="Código Postal" />}
              </form.AppField>
              <div className="flex justify-end">
                <form.Subscribe
                  selector={(state) => {
                    const mainAddressFields = [
                      "mainAddress.address",
                      "mainAddress.city",
                      "mainAddress.state",
                      "mainAddress.zipCode",
                    ] as const;
                    const hasMainAddressErrors = mainAddressFields.some(
                      (field) => !state.fieldMeta[field]?.isValid
                    );
                    return [hasMainAddressErrors];
                  }}
                >
                  {([hasMainAddressErrors]) => (
                    <Button
                      type="button"
                      onClick={onSubmitMainAddress}
                      disabled={hasMainAddressErrors}
                    >
                      Siguiente
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </TabsContent>
            <TabsContent value="subscription" className="space-y-6 pt-4">
              <form.AppField name="subscriptionType">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Tipo de Suscripción</Label>
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={async (value: SubscriptionType) => {
                        field.handleChange(value);
                        await form.validateField(
                          "subscription.paymentFrequency",
                          "submit"
                        );
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={SubscriptionType.free}
                          id={SubscriptionType.free}
                        />
                        <Label htmlFor={SubscriptionType.free}>
                          Suscripción Gratis
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={SubscriptionType.premium}
                          id={SubscriptionType.premium}
                        />
                        <Label htmlFor={SubscriptionType.premium}>
                          Suscripción Premium
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </form.AppField>
              <form.Subscribe
                selector={(state) => [state.values.subscriptionType]}
              >
                {([subscriptionType]) => (
                  <>
                    {subscriptionType === SubscriptionType.premium && (
                      <form.AppField name="subscription.paymentFrequency">
                        {(field) => (
                          <div className="space-y-2">
                            <Label>Frecuencia de Pago</Label>
                            <RadioGroup
                              value={field.state.value as PaymentFrequency}
                              onValueChange={(value: PaymentFrequency) =>
                                field.handleChange(value)
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={PaymentFrequency.monthly}
                                  id={PaymentFrequency.monthly}
                                />
                                <Label htmlFor={PaymentFrequency.monthly}>
                                  Mensual
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={PaymentFrequency.yearly}
                                  id={PaymentFrequency.yearly}
                                />
                                <Label htmlFor={PaymentFrequency.yearly}>
                                  Anual
                                </Label>
                              </div>
                            </RadioGroup>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )}
                          </div>
                        )}
                      </form.AppField>
                    )}
                  </>
                )}
              </form.Subscribe>
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
