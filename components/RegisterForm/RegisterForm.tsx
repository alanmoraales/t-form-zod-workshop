"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // form.handleSubmit();
      }}
      className="space-y-4"
    >
      <Card className="w-full min-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Registro de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>{/** Form fields */}</CardContent>
      </Card>
    </form>
  );
}
