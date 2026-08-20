import type { Metadata } from "next";
import { legal } from "@/data/legal";
import { LegalPage, LegalSection } from "@/shared/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Confidentialité — Brainrototo",
};

export default function Page() {
  return (
    <LegalPage title="Politique de confidentialité">
      <LegalSection title="Responsable">
        <p>
          {legal.publisherName} — {legal.email}. Site : {legal.siteUrl}.
        </p>
      </LegalSection>
      <LegalSection title="Données commandes">
        <p>
          Nom, email, adresse de livraison, contenu du panier, identifiant de
          commande et statut. Base : exécution du contrat (livrer le tee).
          Durée : le temps de la relation commerciale puis obligations légales
          (compta).
        </p>
      </LegalSection>
      <LegalSection title="Paiement">
        <p>
          Le paiement est traité par {legal.paymentProcessor}. Nous ne stockons
          pas les numéros de carte. Stripe agit comme sous-traitant ; leur
          politique s’applique au flux de paiement.
        </p>
      </LegalSection>
      <LegalSection title="Mesure d’audience">
        <p>
          Uniquement si tu cliques « OK » sur la bannière. Identifiant
          technique (localStorage) + événements (pages, panier, checkout). Pas
          de pub tierce. « Refuser » : pas d’envoi vers nos serveurs. Tu peux
          vider le stockage local du navigateur pour réinitialiser.
        </p>
      </LegalSection>
      <LegalSection title="Hébergement">
        <p>
          Serveur et base : {legal.host.name} ({legal.host.region}). Pas de
          transfert hors UE prévu pour ces traitements, hors Stripe selon leur
          documentation.
        </p>
      </LegalSection>
      <LegalSection title="Tes droits">
        <p>
          Accès, rectification, effacement, limitation, opposition, portabilité
          : écris à {legal.email} avec le n° de commande si tu en as un.
          Réclamation : CNIL (cnil.fr).
        </p>
      </LegalSection>
      <LegalSection title="Cookies">
        <p>
          Cookie de session ops (interne, back-office). Boutique : panier en
          localStorage (nécessaire). Mesure d’audience seulement après « OK ».
          Pas de cookie pub.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
