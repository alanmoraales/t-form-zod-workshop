"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Hello World!</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your Next.js app with shadcn/ui components
        </p>
        <Button onClick={() => alert("Hello from shadcn/ui!")}>
          Click me!
        </Button>
      </div>
    </div>
  );
}
