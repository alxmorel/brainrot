import { legal } from "@/data/legal";
import { shippingNote } from "@/data/pricing";

const items = [
  { title: shippingNote, detail: "France & UE" },
  { title: "Tee bio", detail: "Coton SOL'S" },
  { title: legal.deliveryShort, detail: "Print à la commande" },
] as const;

export function CartReassurance() {
  return (
    <ul className="grid grid-cols-3 gap-2 rounded-xl border border-ink/15 bg-white px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5">
      {items.map((item) => (
        <li key={item.title} className="text-center sm:text-left">
          <p className="font-display text-xs font-bold uppercase leading-tight text-ink sm:text-sm">
            {item.title}
          </p>
          <p className="mt-0.5 text-xs font-bold text-ink/55">{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}
