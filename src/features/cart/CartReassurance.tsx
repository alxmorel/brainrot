import { legal } from "@/data/legal";
import { shippingNote } from "@/data/pricing";

const items = [
  { title: shippingNote, detail: "France & UE" },
  { title: "Tee bio", detail: "Coton SOL'S" },
  { title: legal.deliveryShort, detail: "Print à la commande" },
] as const;

export function CartReassurance() {
  return (
    <ul className="grid grid-cols-3 gap-2 rounded-xl border-[3px] border-ink bg-white p-2 shadow-sticker-sm sm:gap-3 sm:p-3">
      {items.map((item) => (
        <li key={item.title} className="text-center sm:text-left">
          <p className="font-display text-[0.62rem] font-bold uppercase leading-tight text-ink sm:text-xs">
            {item.title}
          </p>
          <p className="mt-0.5 hidden text-[0.65rem] font-bold text-ink/55 sm:block">
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}
