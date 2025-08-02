import {
  PaymentFrequency,
  SubscriptionType,
} from "@/server/subscriptions/types";
import { withForm } from "../forms/useAppForm";
import { defaultValues } from "./registerFormSchemas";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export const SubscriptionSection = withForm({
  defaultValues,
  render: function Render({ form }) {
    return (
      <>
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
        <form.Subscribe selector={(state) => [state.values.subscriptionType]}>
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
                          <Label htmlFor={PaymentFrequency.yearly}>Anual</Label>
                        </div>
                      </RadioGroup>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {/* @ts-expect-error - Sometimes the type inference fails */}
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
      </>
    );
  },
});
