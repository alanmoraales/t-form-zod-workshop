import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
  },
  formComponents: {
    SubmitButton,
  },
});

export { withForm };
export default useAppForm;
