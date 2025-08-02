import { useFormContext } from "./useAppForm";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  children: React.ReactNode;
}

export default function SubmitButton({ children }: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full"
        >
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}
