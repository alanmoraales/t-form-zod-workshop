import { useFieldContext } from "./useAppForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OmittedInputProps = "id" | "name" | "value" | "onChange" | "onBlur";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, OmittedInputProps> {
  label: string;
}

export default function TextInput({ label, ...inputProps }: TextInputProps) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        {...inputProps}
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-sm text-destructive">
          {field.state.meta.errors[0]?.message}
        </p>
      )}
    </div>
  );
}
