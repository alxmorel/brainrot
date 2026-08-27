import type { Metadata } from "next";
import Link from "next/link";
import { legal } from "@/data/legal";
import { LegalPage, LegalSection } from "@/shared/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "CGV",
  alternates: { canonical: "/cgv" },
};

export default function Page() {
  return (
    <LegalPage title="Conditions générales de vente">
      <LegalSection title="Objet">
        <p>
          Les présentes CGV régissent la vente de t-shirts imprimés à la commande
          sur {legal.siteUrl}, édité par {legal.publisherName}.
        </p>
      </LegalSection>
      <LegalSection title="Produits">
        <p>
          Tees {legal.brand} personnalisés à partir d’illustrations du catalogue
          (pas de génération IA). Visuels à titre indicatif ; légers écarts
          d’impression possibles.
        </p>
      </LegalSection>
      <LegalSection title="Prix et paiement">
        <p>
          Prix affiché : {legal.priceTtc} par tee, livraison comprise. Paiement par
          carte via{" "}
          {legal.paymentProcessor}. La commande n’est confirmée qu’après
          paiement effectif.
        </p>
      </LegalSection>
      <LegalSection title="Commande">
        <p>
          Tu choisis un visuel, un produit, renseignes l’adresse et paies sur la
          page Stripe. Un numéro de commande s’affiche après paiement.
        </p>
      </LegalSection>
      <LegalSection title="Livraison">
        <p>
          Impression à la demande via un réseau d’imprimeurs locaux (Gelato).
          Délai indicatif : {legal.deliveryEstimate}. Hors UE, le délai peut
          être un peu plus long. Livraison à l’adresse fournie.
        </p>
      </LegalSection>
      <LegalSection title="Droit de rétractation">
        <p>
          Les tees sont confectionnés selon tes choix (visuel / produit).
          Conformément à l’article L. 221-28 3° du Code de la consommation, le
          droit de rétractation de 14 jours ne s’applique pas aux biens
          personnalisés.
        </p>
        <p>
          En cas de défaut ou d’erreur d’impression de notre fait : contact{" "}
          {legal.email} avec le n° de commande. Échange ou remboursement selon
          le cas.
        </p>
      </LegalSection>
      <LegalSection title="Données">
        <p>
          Traitement décrit dans la{" "}
          <Link href="/confidentialite" className="underline hover:text-hot-pink">
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>
      <LegalSection title="Droit applicable">
        <p>Droit français. Médiation de la consommation : à indiquer dès que l’entité est choisie.</p>
      </LegalSection>
    </LegalPage>
  );
}
