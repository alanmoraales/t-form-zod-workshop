import { withForm } from "../forms/useAppForm";
import { baseRegisterSchema, defaultValues } from "./registerFormSchemas";
import { Button } from "../ui/button";

export const MainAddressSection = withForm({
  defaultValues,
  props: {
    onSubmitMainAddress: async () => {},
  },
  render: function Render({ form, onSubmitMainAddress }) {
    return (
      <>
        <form.AppField
          name="mainAddress.address"
          validators={{
            onChange: baseRegisterSchema.shape.mainAddress.shape.address,
          }}
        >
          {(field) => (
            <field.TextInput
              label="Dirección Principal"
              placeholder="Ej: Calle 123, Número 456"
            />
          )}
        </form.AppField>
        <form.AppField
          name="mainAddress.city"
          validators={{
            onChange: baseRegisterSchema.shape.mainAddress.shape.city,
          }}
        >
          {(field) => (
            <field.TextInput label="Ciudad" placeholder="Ej: Mérida" />
          )}
        </form.AppField>
        <form.AppField
          name="mainAddress.state"
          validators={{
            onChange: baseRegisterSchema.shape.mainAddress.shape.state,
          }}
        >
          {(field) => (
            <field.TextInput label="Estado" placeholder="Ej: Yucatán" />
          )}
        </form.AppField>
        <form.AppField
          name="mainAddress.zipCode"
          validators={{
            onChange: baseRegisterSchema.shape.mainAddress.shape.zipCode,
          }}
        >
          {(field) => (
            <field.TextInput
              label="Código Postal"
              placeholder="Ej: 97000"
              type="number"
            />
          )}
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
      </>
    );
  },
});
