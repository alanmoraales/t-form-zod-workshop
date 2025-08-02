"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppForm from "../forms/useAppForm";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useState } from "react";
import { defaultValues, registerSchema } from "./registerFormSchemas";
import { BasicInfoSection } from "./BasicInfoSection";
import { MainAddressSection } from "./MainAddressSection";
import { SubscriptionSection } from "./SubscriptionSection";
import { TabsSection } from "./TabsSection";

export function RegisterForm() {
  const [currentTab, setCurrentTab] = useState<
    "basicInfo" | "mainAddress" | "subscription"
  >("basicInfo");
  const form = useAppForm({
    defaultValues,
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
              <TabsSection form={form} />
            </TabsList>
            <TabsContent value="basicInfo" className="space-y-4 pt-4">
              <BasicInfoSection
                form={form}
                onSubmitBasicInfo={onSubmitBasicInfo}
              />
            </TabsContent>
            <TabsContent value="mainAddress" className="space-y-4 pt-4">
              <MainAddressSection
                form={form}
                onSubmitMainAddress={onSubmitMainAddress}
              />
            </TabsContent>
            <TabsContent value="subscription" className="space-y-6 pt-4">
              <SubscriptionSection form={form} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  );
}
