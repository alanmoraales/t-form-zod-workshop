import { withForm } from "../forms/useAppForm";
import { Button } from "../ui/button";
import { baseRegisterSchema, defaultValues } from "./registerFormSchemas";

export const BasicInfoSection = withForm({
  defaultValues,
  props: {
    onSubmitBasicInfo: async () => {},
  },
  render: function Render({ form, onSubmitBasicInfo }) {
    return (
      <>
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
      </>
    );
  },
});
