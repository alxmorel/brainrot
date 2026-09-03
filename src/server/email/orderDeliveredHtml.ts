import { legal } from "@/data/legal";
import type { Order } from "@/models";
import { createOrderAccessToken } from "@/server/orders/orderAccessToken";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function orderFollowUrl(orderId: string) {
  const token = createOrderAccessToken(orderId);
  return `${legal.siteUrl}/commande?token=${encodeURIComponent(token)}`;
}

export function buildOrderDeliveredHtml(order: Order) {
  const { shipping } = order;
  const followUrl = orderFollowUrl(order.id);

  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background:#f3f1ec;font-family:Arial,Helvetica,sans-serif;color:#0a0a0a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f1ec;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:3px solid #0a0a0a;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 24px 8px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ff2fb3;">Brainrototo</p>
                <h1 style="margin:0;font-size:28px;line-height:1.05;text-transform:uppercase;">Ton tee est arrivé</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:#3d3d3d;">
                  ${escapeHtml(shipping.name)}, le colis est marqué livré. À porter.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 0;">
                <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;color:#7a7a7a;">Numéro de commande</p>
                <p style="margin:4px 0 0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(order.id)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 0;">
                <a href="${escapeHtml(followUrl)}" style="display:inline-block;background:#ff2fb3;color:#ffffff;font-weight:700;text-transform:uppercase;text-decoration:none;padding:12px 22px;border:3px solid #0a0a0a;border-radius:999px;">
                  Voir ma commande →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 28px;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:#5c5c5c;">
                  Une question ? Écris à <a href="mailto:${escapeHtml(legal.email)}" style="color:#0a0a0a;">${escapeHtml(legal.email)}</a> avec ton n° de commande.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildOrderDeliveredText(order: Order) {
  const followUrl = orderFollowUrl(order.id);
  return [
    "Brainrototo - Ton tee est arrivé",
    "",
    `${order.shipping.name}, le colis est marqué livré. À porter.`,
    "",
    `Commande ${order.id}`,
    `Voir ma commande : ${followUrl}`,
    "",
    `Contact : ${legal.email}`,
  ].join("\n");
}
