"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAccount } from "@/features/account/AccountProvider";
import { useShop } from "@/features/shop/ShopProvider";
import { formatWelcomeOffer } from "@/data/pricing";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button, Input } from "@/shared/components/ui";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/compte";
  return value;
}

export function SignupForm() {
  return <AuthForm mode="signup" />;
}

export function LoginForm() {
  return <AuthForm mode="login" />;
}

function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAccount();
  const shop = useShop();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";
  const next = searchParams.get("next");
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  async function onSubmit(form: FormData) {
    setPending(true);
    setError(null);
    const response = await fetch(
      isSignup ? "/api/account/signup" : "/api/account/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      },
    );
    const json: unknown = await response.json().catch(() => null);
    setPending(false);
    if (!response.ok) {
      const message =
        json && typeof json === "object" && "error" in json
          ? String((json as { error: unknown }).error)
          : "Ça n’a pas marché. Réessaie.";
      setError(message);
      return;
    }
    await refresh();
    router.replace(safeNext(searchParams.get("next")));
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10">
        <h1 className="font-display text-3xl font-bold uppercase leading-none text-ink">
          {isSignup ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mt-2 text-sm font-bold text-ink/60">
          {isSignup
            ? shop.welcomeLive
              ? `Entre ${shop.welcomeCode} au paiement. ${formatWelcomeOffer(shop)}, ${shop.welcomeTtlDays} jours.`
              : "Retrouve tes commandes et ton crédit boutique."
            : "Retrouve ton crédit et tes commandes."}
        </p>
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(new FormData(event.currentTarget));
          }}
        >
          <Input
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            required
          />
          <Input
            name="password"
            type="password"
            label="Mot de passe"
            autoComplete={isSignup ? "new-password" : "current-password"}
            hint={isSignup ? "8 caractères minimum." : undefined}
            required
            minLength={8}
          />
          {error ? <p className="text-sm font-bold text-hot-pink">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "…" : isSignup ? "Créer mon compte" : "Entrer"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm font-bold text-ink/60">
          {isSignup ? (
            <>
              Déjà un compte ?{" "}
              <Link
                href={`/compte/connexion${nextQuery}`}
                className="text-hot-pink underline"
              >
                Connexion
              </Link>
            </>
          ) : (
            <>
              Pas encore ?{" "}
              <Link
                href={`/compte/inscription${nextQuery}`}
                className="text-hot-pink underline"
              >
                Créer un compte
              </Link>
            </>
          )}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
