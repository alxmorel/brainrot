import type { Metadata } from "next";
import Link from "next/link";
import { legal } from "@/data/legal";
import { formatEur, formatWelcomeOffer } from "@/data/pricing";
import { getShopSettings } from "@/server/shop-settings";
import { LegalPage, LegalSection } from "@/shared/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "CGV",
  alternates: { canonical: "/cgv" },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const shop = await getShopSettings();
  const priceTtc = `${formatEur(shop.teePriceCents)} TTC`;
  const priceCompare =
    shop.teeCompareAtCents > shop.teePriceCents
      ? formatEur(shop.teeCompareAtCents)
      : null;

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
          Prix : {priceTtc} par tee, livraison comprise
          {priceCompare ? ` (prix barré ${priceCompare})` : ""}. Paiement par
          carte via {legal.paymentProcessor}. La commande n’est confirmée
          qu’après paiement effectif.
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
      <LegalSection title="Compte, code welcome et crédit">
        <p>
          {shop.welcomeEnabled ? (
            <>
              {shop.welcomeRequiresAccount
                ? "La création d’un compte donne accès au"
                : "Le"}{" "}
              code {shop.welcomeCode} ({formatWelcomeOffer(shop)}), valable{" "}
              {shop.welcomeTtlDays} jours à compter de l’inscription, à saisir
              au paiement, une fois.
            </>
          ) : (
            <>Le code d’ouverture n’est pas actif actuellement.</>
          )}{" "}
          {shop.cashbackEnabled ? (
            <>
              Un crédit boutique (en euros, pas en pourcentage) peut être
              attribué dès le {shop.cashbackMinQty}
              <sup>e</sup> tee d’une même commande (
              {formatEur(shop.cashbackPerExtraTeeCents)} par tee supplémentaire),
              si tu es connecté au paiement. Le crédit s’utilise sur une
              commande suivante, n’est pas remboursable en espèces, et expire
              seulement pour le code welcome.
            </>
          ) : null}
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
