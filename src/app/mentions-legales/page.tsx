import type { Metadata } from "next";
import { legal } from "@/data/legal";
import { LegalPage, LegalSection } from "@/shared/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function Page() {
  return (
    <LegalPage title="Mentions légales">
      <LegalSection title="Éditeur">
        <p>
          Le site {legal.siteName} ({legal.siteUrl}) est édité par {legal.publisherName},{" "}
          {legal.legalForm}.
        </p>
        <p>Adresse : {legal.address}</p>
        <p>SIRET : {legal.siret}</p>
        <p>RCS : {legal.rcs}</p>
        <p>TVA : {legal.vat}</p>
        <p>
          Contact : {legal.email}
          {legal.phone ? ` - ${legal.phone}` : null}
        </p>
      </LegalSection>
      <LegalSection title="Directeur de la publication">
        <p>{legal.publicationDirector}</p>
      </LegalSection>
      <LegalSection title="Hébergement">
        <p>
          {legal.host.name}, région {legal.host.region}.
        </p>
      </LegalSection>
      <LegalSection title="Propriété intellectuelle">
        <p>
          Illustrations, nom {legal.brand}, logos et contenus du site sont protégés.
          Toute reproduction non autorisée est interdite.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
