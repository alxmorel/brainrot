import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Choisis un Brainrototo",
    text: "Parcours la collection, filtre un combo, pick une illu.",
  },
  {
    n: "02",
    title: "Taille + panier",
    text: "Un tee bio, un prix, livraison comprise.",
  },
  {
    n: "03",
    title: "On imprime",
    text: "À la commande, chez toi en 2–7 jours.",
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section className="px-3 py-8 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-hot-pink sm:text-xs">
          Comment ça marche
        </p>
        <h2 className="mt-0.5 font-display text-[clamp(1.45rem,4vw,3rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
          Choisis. Porte. Reçois.
        </h2>

        <ol className="mt-5 grid grid-cols-1 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="flex items-center gap-3 rounded-xl border-[3px] border-ink bg-white p-2.5 shadow-sticker-sm sm:block sm:rounded-2xl sm:p-5"
            >
              <p className="font-display text-sm font-bold uppercase tracking-tight text-hot-pink">
                {step.n}
              </p>
              <div>
                <h3 className="font-display text-sm font-bold uppercase leading-none text-ink sm:mt-2 sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 hidden text-sm font-bold leading-snug text-ink/70 sm:block">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 sm:mt-8">
          <Link
            href="/create"
            className="inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker sm:w-auto"
          >
            Choisir mon tee →
          </Link>
        </div>
      </div>
    </section>
  );
}
