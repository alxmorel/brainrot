import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BrandWordmark,
  Doodle,
  MarkHighlight,
} from "@/shared/components/brand";
import { GrainOverlay, SplashField } from "@/shared/components/effects";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Surface,
} from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";

const palette = [
  { name: "Pink", token: "--br-pink", className: "bg-hot-pink" },
  { name: "Orange", token: "--br-orange", className: "bg-fluoro-orange" },
  { name: "Yellow", token: "--br-yellow", className: "bg-acid-yellow" },
  { name: "Lime", token: "--br-lime", className: "bg-acid-green" },
  { name: "Cyan", token: "--br-cyan", className: "bg-electric-cyan" },
  { name: "Blue", token: "--br-blue", className: "bg-blue" },
  { name: "Purple", token: "--br-purple", className: "bg-ultraviolet" },
] as const;

const displayCandidates = [
  {
    id: "fredoka",
    name: "Fredoka",
    fontClass: "font-fredoka",
    verdict: "CHOISI",
    selected: true,
    note: "Bubble + lisible — base logo / hero / noms.",
  },
  {
    id: "titan",
    name: "Titan One",
    fontClass: "font-titan",
    verdict: "ALT",
    selected: false,
    note: "Plus comic lourd — accents ponctuels possibles.",
  },
  {
    id: "lilita",
    name: "Lilita One",
    fontClass: "font-lilita",
    verdict: "ALT",
    selected: false,
    note: "Épais, moins candy que Fredoka.",
  },
  {
    id: "coiny",
    name: "Coiny",
    fontClass: "font-coiny",
    verdict: "ALT",
    selected: false,
    note: "Très jouet — trop niche en display global.",
  },
] as const;

function PlaceholderCharacter({ label }: { label: string }) {
  return (
    <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <div className="relative flex h-full w-full animate-float items-center justify-center rounded-[1.75rem] border-[3px] border-ink bg-white shadow-sticker">
        <span className="font-display text-4xl font-bold text-ink text-sticker">
          {label}
        </span>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-hot-pink">
          {eyebrow}
        </p>
        <h2 className="font-display text-title font-bold text-ink">{title}</h2>
      </header>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-4 py-10 sm:px-8 sm:py-14">
      <SplashField />
      <GrainOverlay />
      <Doodle kind="star" className="right-[6%] top-[12%] rotate-12" />
      <Doodle kind="smile" className="left-[4%] top-[40%] -rotate-6" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 sm:gap-20">
        <header className="space-y-6">
          <Link
            href="/"
            className="inline-flex text-xs font-bold uppercase tracking-wide text-muted transition-colors hover:text-hot-pink"
          >
            ← Back home
          </Link>
          <BrandWordmark subtitle="Lab" />
          <p className="max-w-2xl text-xl font-bold leading-snug text-ink sm:text-2xl">
            Direction visuelle : collage sticker +{" "}
            <MarkHighlight>paint splash</MarkHighlight> + outlines noirs
          </p>
          <p className="max-w-2xl text-base text-muted sm:text-lg">
            Moins soft lifestyle, plus Brainrot Wear : papier clair, explosions
            peintes, boutons sticker, marqueur noir derrière les mots forts.
          </p>
        </header>

        <Section eyebrow="00 / Reference" title="Target energy">
          <Surface variant="sticker" className="overflow-hidden !rotate-[-1deg] !p-0">
            <Image
              src="/assets/decorations/reference-brainrot-wear.png"
              alt="Référence visuelle Brainrot Wear — collage sticker et paint splash"
              width={1600}
              height={900}
              className="h-auto w-full"
              priority
            />
          </Surface>
        </Section>

        <Section eyebrow="01 / Type bake-off" title="Display candidates">
          <div className="grid gap-4 lg:grid-cols-2">
            {displayCandidates.map((candidate) => (
              <Surface
                key={candidate.id}
                variant={candidate.selected ? "acid" : "solid"}
                className={cn(candidate.selected && "!rotate-[-1deg]")}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    {candidate.name}
                  </p>
                  <Badge tone={candidate.selected ? "pink" : "yellow"}>
                    {candidate.verdict}
                  </Badge>
                </div>
                <p className={cn(candidate.fontClass, "text-4xl text-ink")}>
                  Brainrot Wear
                </p>
                <p
                  className={cn(
                    candidate.fontClass,
                    "mt-2 text-2xl text-hot-pink",
                  )}
                >
                  Banacrocodilo Bambino
                </p>
                <p className="mt-4 text-sm text-muted">{candidate.note}</p>
              </Surface>
            ))}
          </div>
        </Section>

        <Section eyebrow="02 / Brand tricks" title="Marker + doodles">
          <Surface variant="paper" className="space-y-5">
            <p className="text-2xl font-bold leading-tight text-ink sm:text-3xl">
              Des t-shirts <MarkHighlight>Brainrot</MarkHighlight> aussi absurdes
              que toi
            </p>
            <div className="relative min-h-24">
              <Doodle kind="star" className="left-0 top-0" />
              <Doodle kind="bolt" className="left-16 top-2 text-acid-yellow" />
              <Doodle kind="burst" className="left-32 top-0" />
              <Doodle kind="smile" className="left-48 top-1" />
            </div>
            <p className="text-sm text-muted">
              Fredoka en marque. Nunito Sans en UI. Pas de cartoon sur labels /
              prix / forms.
            </p>
          </Surface>
        </Section>

        <Section eyebrow="03 / Color" title="Pop palette">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {palette.map((swatch) => (
              <Surface
                key={swatch.name}
                variant="solid"
                className="flex flex-col gap-3 !p-3"
              >
                <div
                  className={`h-20 rounded-xl border-[3px] border-ink ${swatch.className}`}
                />
                <div>
                  <p className="font-display text-sm font-bold text-ink">
                    {swatch.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">{swatch.token}</p>
                </div>
              </Surface>
            ))}
          </div>
        </Section>

        <Section eyebrow="04 / Buttons" title="Sticker CTAs">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Découvrir la collection →</Button>
            <Button variant="secondary">Wear This</Button>
            <Button variant="holo">Choose This One</Button>
            <Button variant="ghost">Create Another</Button>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </Section>

        <Section eyebrow="05 / Badges" title="Sticker tags">
          <div className="flex flex-wrap gap-2">
            <Badge tone="violet">10-16 ans</Badge>
            <Badge tone="pink">Cursed</Badge>
            <Badge tone="yellow">Cute</Badge>
            <Badge rarity="rare">Rare</Badge>
            <Badge rarity="legendary">Legendary</Badge>
          </div>
        </Section>

        <Section eyebrow="06 / Cards" title="Toy packaging">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              pack="sunset"
              title="Banacrocodilo Bambino"
              meta={<Badge rarity="rare">Rare Brainrot</Badge>}
              media={<PlaceholderCharacter label="BC" />}
            >
              <p className="text-sm text-muted">Outline noir + ombre sticker.</p>
            </Card>
            <Card
              pack="ocean"
              selected
              title="Fragolafrogo"
              meta={<Badge rarity="legendary">Legendary</Badge>}
              media={<PlaceholderCharacter label="FF" />}
            >
              <p className="text-sm text-muted">Selected = tilt léger.</p>
            </Card>
            <Card
              pack="acid"
              title="Melonsharko"
              meta={<Badge tone="green">Chaotic</Badge>}
              media={<PlaceholderCharacter label="MS" />}
            >
              <p className="text-sm text-muted">Pack acid figurine.</p>
            </Card>
          </div>
        </Section>

        <Section eyebrow="07 / Forms" title="Functional UI">
          <Surface variant="solid" className="grid gap-4 md:grid-cols-2">
            <Input
              label="Brainrot name"
              placeholder="Banacrocodilo Bambino"
              hint="Label body neutre — pas display bubble."
            />
            <Select
              label="Vibe"
              placeholder="Pick a vibe"
              defaultValue=""
              options={[
                { value: "italian", label: "Italian" },
                { value: "cute", label: "Cute" },
                { value: "cursed", label: "Cursed" },
                { value: "chaotic", label: "Chaotic" },
                { value: "luxury", label: "Luxury" },
              ]}
            />
          </Surface>
        </Section>
      </div>
    </main>
  );
}
