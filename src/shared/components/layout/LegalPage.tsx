import type { ReactNode } from "react";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <p className="rounded-xl border-[3px] border-ink bg-acid-yellow px-3 py-2 text-xs font-bold text-ink">
          Textes types - à valider avec un conseil. Complète{" "}
          <code className="font-mono">src/data/legal.ts</code> (identité, SIRET,
          email).
        </p>
        <h1 className="mt-6 font-display text-3xl font-bold uppercase leading-none tracking-[-0.04em] text-ink">
          {title}
        </h1>
        <div className="mt-6 flex flex-col gap-5 text-sm font-bold leading-relaxed text-ink/80">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold uppercase text-ink">{title}</h2>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </section>
  );
}
