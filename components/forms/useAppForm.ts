import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    TextInput,
  },
  formComponents: {
    SubmitButton,
  },
});

export default useAppForm;
