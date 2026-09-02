"use client";

import { useEffect, useState } from "react";
import { formatEur, formatWelcomeOffer } from "@/data/pricing";
import { DEFAULT_SHOP, type ShopPublicSettings } from "@/models/shop";
import { Button, Input, Select } from "@/shared/components/ui";

function eurosFromCents(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function centsFromEuros(value: string) {
  const n = Number(value.replace(",", ".").trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function OpsShopForm() {
  const [shop, setShop] = useState<ShopPublicSettings | null>(null);
  const [price, setPrice] = useState("");
  const [compare, setCompare] = useState("");
  const [mysteryPrice, setMysteryPrice] = useState("");
  const [welcomeEnabled, setWelcomeEnabled] = useState(true);
  const [welcomeCode, setWelcomeCode] = useState("BAMBINO");
  const [welcomeKind, setWelcomeKind] = useState<"percent" | "amount">("percent");
  const [welcomePercent, setWelcomePercent] = useState("10");
  const [welcomeAmount, setWelcomeAmount] = useState("2,00");
  const [welcomeRequiresAccount, setWelcomeRequiresAccount] = useState(true);
  const [welcomeTtlDays, setWelcomeTtlDays] = useState("7");
  const [welcomeStartsAt, setWelcomeStartsAt] = useState("");
  const [welcomeEndsAt, setWelcomeEndsAt] = useState("");
  const [cashbackEnabled, setCashbackEnabled] = useState(true);
  const [cashbackAmount, setCashbackAmount] = useState("2,00");
  const [cashbackMinQty, setCashbackMinQty] = useState("2");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  function fill(settings: ShopPublicSettings) {
    setShop(settings);
    setPrice(eurosFromCents(settings.teePriceCents));
    setCompare(eurosFromCents(settings.teeCompareAtCents));
    setMysteryPrice(eurosFromCents(settings.mysteryTeePriceCents));
    setWelcomeEnabled(settings.welcomeEnabled);
    setWelcomeCode(settings.welcomeCode);
    setWelcomeKind(settings.welcomeKind);
    setWelcomePercent(String(settings.welcomePercent));
    setWelcomeAmount(eurosFromCents(settings.welcomeAmountCents));
    setWelcomeRequiresAccount(settings.welcomeRequiresAccount);
    setWelcomeTtlDays(String(settings.welcomeTtlDays));
    setWelcomeStartsAt(toLocalInput(settings.welcomeStartsAt));
    setWelcomeEndsAt(toLocalInput(settings.welcomeEndsAt));
    setCashbackEnabled(settings.cashbackEnabled);
    setCashbackAmount(eurosFromCents(settings.cashbackPerExtraTeeCents));
    setCashbackMinQty(String(settings.cashbackMinQty));
  }

  useEffect(() => {
    void fetch("/api/ops/settings")
      .then((response) => response.json())
      .then((json: unknown) => {
        if (
          json &&
          typeof json === "object" &&
          "settings" in json
        ) {
          fill((json as { settings: ShopPublicSettings }).settings);
        } else {
          fill(DEFAULT_SHOP);
        }
      })
      .catch(() => fill(DEFAULT_SHOP));
  }, []);

  async function onSubmit() {
    setPending(true);
    setError(null);
    setSaved(false);
    const teePriceCents = centsFromEuros(price);
    const teeCompareAtCents = centsFromEuros(compare);
    const mysteryTeePriceCents = centsFromEuros(mysteryPrice);
    const welcomeAmountCents = centsFromEuros(welcomeAmount);
    const cashbackPerExtraTeeCents = centsFromEuros(cashbackAmount);
    if (
      teePriceCents === null ||
      teeCompareAtCents === null ||
      mysteryTeePriceCents === null ||
      welcomeAmountCents === null ||
      cashbackPerExtraTeeCents === null
    ) {
      setPending(false);
      setError("Montants invalides.");
      return;
    }
    const response = await fetch("/api/ops/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teePriceCents,
        teeCompareAtCents,
        mysteryTeePriceCents,
        welcomeEnabled,
        welcomeCode,
        welcomeKind,
        welcomePercent: Number(welcomePercent),
        welcomeAmountCents,
        welcomeRequiresAccount,
        welcomeTtlDays: Number(welcomeTtlDays),
        welcomeStartsAt: fromLocalInput(welcomeStartsAt),
        welcomeEndsAt: fromLocalInput(welcomeEndsAt),
        cashbackEnabled,
        cashbackPerExtraTeeCents,
        cashbackMinQty: Number(cashbackMinQty),
      }),
    });
    const json: unknown = await response.json().catch(() => null);
    setPending(false);
    if (!response.ok) {
      const message =
        json && typeof json === "object" && "error" in json
          ? String((json as { error: unknown }).error)
          : "Enregistrement impossible.";
      setError(message);
      return;
    }
    if (json && typeof json === "object" && "settings" in json) {
      fill((json as { settings: ShopPublicSettings }).settings);
    }
    setSaved(true);
  }

  if (!shop) {
    return <p className="font-bold">Chargement…</p>;
  }

  return (
    <form
      className="flex max-w-xl flex-col gap-8"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <div>
        <h2 className="font-display text-2xl font-bold uppercase">Boutique</h2>
        <p className="mt-1 text-sm font-bold text-ink/60">
          Prix, code welcome et cashback. En vigueur tout de suite sur le site.
        </p>
        <p className="mt-2 font-display text-sm font-bold text-hot-pink">
          Aperçu code : {formatWelcomeOffer(shop)} · {shop.welcomeCode}
          {shop.welcomeLive ? " · actif" : " · inactif"}
        </p>
      </div>

      <section className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
        <h3 className="font-display text-lg font-bold uppercase">Prix tee</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            label="Prix payé (€)"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            inputMode="decimal"
            required
          />
          <Input
            label="Prix barré (€)"
            hint="0 pour masquer le barré"
            value={compare}
            onChange={(event) => setCompare(event.target.value)}
            inputMode="decimal"
          />
          <Input
            label="Mystery Tee (€)"
            hint="Sous le prix classique"
            value={mysteryPrice}
            onChange={(event) => setMysteryPrice(event.target.value)}
            inputMode="decimal"
            required
          />
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
        <h3 className="font-display text-lg font-bold uppercase">Code welcome</h3>
        <label className="mt-3 flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={welcomeEnabled}
            onChange={(event) => setWelcomeEnabled(event.target.checked)}
          />
          Campagne active
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            label="Code public"
            value={welcomeCode}
            onChange={(event) => setWelcomeCode(event.target.value.toUpperCase())}
            required
          />
          <Select
            label="Type de réduction"
            value={welcomeKind}
            onChange={(event) =>
              setWelcomeKind(event.target.value === "amount" ? "amount" : "percent")
            }
            options={[
              { value: "percent", label: "Pourcentage" },
              { value: "amount", label: "Montant fixe (€)" },
            ]}
          />
          {welcomeKind === "percent" ? (
            <Input
              label="Pourcentage"
              value={welcomePercent}
              onChange={(event) => setWelcomePercent(event.target.value)}
              type="number"
              min={1}
              max={100}
              required
            />
          ) : (
            <Input
              label="Montant (€)"
              value={welcomeAmount}
              onChange={(event) => setWelcomeAmount(event.target.value)}
              inputMode="decimal"
              required
            />
          )}
          <Input
            label="Durée après inscription (jours)"
            value={welcomeTtlDays}
            onChange={(event) => setWelcomeTtlDays(event.target.value)}
            type="number"
            min={1}
            max={365}
            required
          />
          <Input
            label="Début de campagne"
            hint="Vide = tout de suite"
            type="datetime-local"
            value={welcomeStartsAt}
            onChange={(event) => setWelcomeStartsAt(event.target.value)}
          />
          <Input
            label="Fin de campagne"
            hint="Vide = pas de fin"
            type="datetime-local"
            value={welcomeEndsAt}
            onChange={(event) => setWelcomeEndsAt(event.target.value)}
          />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={welcomeRequiresAccount}
            onChange={(event) => setWelcomeRequiresAccount(event.target.checked)}
          />
          Compte requis pour activer le code
        </label>
      </section>

      <section className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
        <h3 className="font-display text-lg font-bold uppercase">Cashback</h3>
        <p className="mt-1 text-sm font-bold text-ink/55">
          Crédit en euros, pas en %. Ex. {formatEur(shop.cashbackPerExtraTeeCents)}{" "}
          dès le {shop.cashbackMinQty}
          <sup>e</sup> tee, si connecté.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={cashbackEnabled}
            onChange={(event) => setCashbackEnabled(event.target.checked)}
          />
          Cashback actif
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            label="Crédit par tee extra (€)"
            value={cashbackAmount}
            onChange={(event) => setCashbackAmount(event.target.value)}
            inputMode="decimal"
          />
          <Input
            label="À partir du n° tee"
            value={cashbackMinQty}
            onChange={(event) => setCashbackMinQty(event.target.value)}
            type="number"
            min={1}
            max={20}
          />
        </div>
      </section>

      {error ? <p className="text-sm font-bold text-hot-pink">{error}</p> : null}
      {saved ? <p className="text-sm font-bold text-ink">Enregistré.</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "…" : "Enregistrer"}
      </Button>
    </form>
  );
}
