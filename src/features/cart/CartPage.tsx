"use client";

import Image from "next/image";
import Link from "next/link";
import { brainrots } from "@/data/brainrots";
import { products } from "@/data/products";
import { useCart } from "@/features/cart/CartProvider";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";

export function CartPage() {
  const { items, removeItem } = useCart();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-bold uppercase leading-none text-ink">
          Panier
        </h1>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border-[3px] border-ink bg-white px-4 py-10 text-center shadow-sticker-sm">
            <p className="font-display text-lg font-bold uppercase text-ink">
              Panier vide
            </p>
            <p className="mt-1 text-sm font-bold text-ink/60">
              Crée un Brainrototo et porte-le sur un tee.
            </p>
            <Link
              href="/create"
              className="mt-4 inline-flex items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
            >
              Create →
            </Link>
          </div>
        ) : (
          <>
          <ul className="mt-6 flex flex-col gap-3">
            {items.map((item) => {
              const brainrot = brainrots.find((b) => b.id === item.brainrotId);
              const product = products.find((p) => p.id === item.productId);
              if (!brainrot || !product) return null;
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-white p-3 shadow-sticker-sm"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-[3px] border-ink bg-acid-yellow">
                    <Image
                      src={brainrot.image}
                      alt=""
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-bold leading-tight text-ink">
                      {brainrot.name}
                    </p>
                    <p className="text-sm font-bold text-ink/60">
                      {product.name} · {item.size} · ×{item.quantity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-display text-xs font-bold uppercase text-hot-pink"
                  >
                    Retirer
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
          >
            Commander →
          </Link>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
