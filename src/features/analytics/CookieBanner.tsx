"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/shared/utils/track";

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/ops")) {
      setVisible(false);
      return;
    }
    setVisible(getConsent() === null);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-4">
      <div className="mx-auto flex max-w-lg flex-col gap-3 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker">
        <p className="text-sm font-bold leading-snug text-ink/80">
          On compte les visites pour soigner Brainrototo. Zéro pub. Tu peux refuser, le shop marche pareil.{" "}
          <Link href="/confidentialite" className="underline hover:text-hot-pink">
            Confidentialité
          </Link>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-pill border-[3px] border-ink bg-hot-pink px-4 py-2 font-display text-xs font-bold uppercase text-white shadow-sticker-sm"
            onClick={() => {
              setConsent("all");
              setVisible(false);
            }}
          >
            OK
          </button>
          <button
            type="button"
            className="rounded-pill border-[3px] border-ink bg-white px-4 py-2 font-display text-xs font-bold uppercase text-ink shadow-sticker-sm"
            onClick={() => {
              setConsent("necessary");
              setVisible(false);
            }}
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
