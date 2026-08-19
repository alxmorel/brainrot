"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/shared/components/ui";

export function OpsLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(form: FormData) {
    setPending(true);
    setError(null);
    const response = await fetch("/api/ops/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: String(form.get("password") ?? "") }),
    });
    setPending(false);
    if (!response.ok) {
      setError("Mot de passe incorrect.");
      return;
    }
    const next = searchParams.get("next") || "/ops";
    router.replace(next.startsWith("/ops") ? next : "/ops");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-3xl font-bold uppercase">Ops</h1>
      <p className="mt-2 text-sm font-bold text-ink/60">Accès interne uniquement.</p>
      <form
        className="mt-6 flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(new FormData(event.currentTarget));
        }}
      >
        <Input name="password" type="password" label="Mot de passe" required />
        {error ? <p className="text-sm font-bold text-hot-pink">{error}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "…" : "Entrer"}
        </Button>
      </form>
    </main>
  );
}
