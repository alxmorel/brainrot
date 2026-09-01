"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UnusedCredit } from "@/features/account/UnusedCredit";
import { useAccount } from "@/features/account/AccountProvider";
import { useShop } from "@/features/shop/ShopProvider";
import { formatEur, formatWelcomeOffer } from "@/data/pricing";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button } from "@/shared/components/ui";
import type { AccountMe, PublicOrderView } from "@/models";

export function AccountHome({
  user,
  orders,
}: {
  user: AccountMe;
  orders: PublicOrderView[];
}) {
  const router = useRouter();
  const { refresh } = useAccount();
  const shop = useShop();

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    await refresh();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold uppercase leading-none text-ink">
          Mon compte
        </h1>
        <p className="mt-2 text-sm font-bold text-ink/60">{user.email}</p>

        <div className="mt-6 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
          <UnusedCredit cents={user.creditCents} />
          {user.creditCents <= 0 ? (
            <p className="font-display text-sm font-bold uppercase text-ink/55">
              Pas de crédit pour l’instant
            </p>
          ) : null}
          <p className="mt-1 text-2xl font-display font-bold uppercase text-ink">
            {formatEur(user.creditCents)}
          </p>
          <p className="mt-1 text-xs font-bold text-ink/50">
            Crédit boutique, en euros. Utilisable à la prochaine commande.
          </p>
        </div>

        {user.welcomeValid ? (
          <div className="mt-4 rounded-2xl border-[3px] border-ink bg-acid-yellow p-4 shadow-sticker-sm">
            <p className="font-display text-xs font-bold uppercase text-ink/60">
              Offre d’ouverture · {shop.welcomeTtlDays} jours ·{" "}
              {user.welcomeOffer ?? formatWelcomeOffer(shop)}
            </p>
            <p className="mt-1 font-display text-2xl font-bold tracking-[0.12em] text-ink">
              {user.welcomeCode}
            </p>
            <p className="mt-1 text-xs font-bold text-ink/55">
              À entrer toi-même au paiement.
              {user.welcomeExpiresAt
                ? ` Valable jusqu’au ${new Date(user.welcomeExpiresAt).toLocaleDateString("fr-FR")}.`
                : ""}
            </p>
            <Link
              href="/cart#promo"
              className="mt-2 inline-block text-sm font-bold text-hot-pink underline"
            >
              Aller au panier →
            </Link>
          </div>
        ) : null}

        <h2 className="mt-8 font-display text-lg font-bold uppercase text-ink">
          Commandes
        </h2>
        {orders.length === 0 ? (
          <p className="mt-2 text-sm font-bold text-ink/55">
            Rien encore.{" "}
            <Link href="/cart" className="text-hot-pink underline">
              Voir le panier
            </Link>
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/commande?id=${encodeURIComponent(order.id)}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border-[3px] border-ink bg-white px-3 py-3 shadow-sticker-sm"
                >
                  <span className="font-display text-sm font-bold uppercase text-ink">
                    {order.id}
                  </span>
                  <span className="text-xs font-bold text-ink/55">
                    {formatEur(order.totalCents)} · {order.statusLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Button variant="ghost" className="mt-8 w-full" onClick={() => void logout()}>
          Se déconnecter
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
