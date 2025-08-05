import { withForm } from "../forms/useAppForm";
import { Badge } from "../ui/badge";
import { TabsTrigger } from "../ui/tabs";
import { defaultValues } from "./registerFormSchemas";

export const TabsSection = withForm({
  defaultValues,
  render: function Render({ form }) {
    return (
      <>
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
            const subscriptionFieldsErrorsCount = subscriptionFields.reduce(
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
      </>
    );
  },
});
