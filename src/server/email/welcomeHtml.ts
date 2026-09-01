import { formatWelcomeOffer } from "@/data/pricing";
import type { ShopPublicSettings } from "@/models/shop";
import { DEFAULT_SHOP } from "@/models/shop";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildWelcomeEmailHtml(
  code: string,
  shop: ShopPublicSettings = DEFAULT_SHOP,
) {
  const offer = formatWelcomeOffer(shop);
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background:#f3f1ec;font-family:Arial,Helvetica,sans-serif;color:#0a0a0a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f1ec;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:3px solid #0a0a0a;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 24px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ff2fb3;">Brainrototo</p>
                <h1 style="margin:0;font-size:28px;line-height:1.05;text-transform:uppercase;">Ton code d’ouverture</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:#3d3d3d;">
                  Bienvenue. ${escapeHtml(offer)} sur ta première commande, valable ${shop.welcomeTtlDays} jours. Entre le code toi-même au paiement.
                </p>
                <p style="margin:20px 0 0;font-size:12px;font-weight:700;text-transform:uppercase;color:#7a7a7a;">Code</p>
                <p style="margin:4px 0 0;font-size:26px;font-weight:700;letter-spacing:0.04em;">${escapeHtml(code)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildWelcomeEmailText(
  code: string,
  shop: ShopPublicSettings = DEFAULT_SHOP,
) {
  return [
    "Brainrototo - Ton code d’ouverture",
    "",
    `Bienvenue. ${formatWelcomeOffer(shop)} sur ta première commande, valable ${shop.welcomeTtlDays} jours. Entre le code au paiement.`,
    "",
    `Code : ${code}`,
  ].join("\n");
}
