import { legal } from "@/data/legal";
import type { Order } from "@/models";
import { isHttpUrl } from "@/server/fulfillment/gelatoWebhook";
import { createOrderAccessToken } from "@/server/orders/orderAccessToken";
import { orderEtaLabel } from "@/server/orders/eta";

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

function trackingBlock(order: Order) {
  const trackingUrl =
    order.supplier.trackingUrl && isHttpUrl(order.supplier.trackingUrl)
      ? order.supplier.trackingUrl
      : null;
  const trackingCode = order.supplier.tracking;
  const carrier = order.supplier.carrier;
  const commandeUrl = orderFollowUrl(order.id);

  const carrierHtml = carrier
    ? `<tr>
              <td style="padding:16px 24px 0;">
                <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;color:#7a7a7a;">Transporteur</p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;">${escapeHtml(carrier)}</p>
              </td>
            </tr>`
    : "";

  const codeHtml = trackingCode
    ? `<tr>
              <td style="padding:16px 24px 0;">
                <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;color:#7a7a7a;">N° de suivi</p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;">${escapeHtml(trackingCode)}</p>
              </td>
            </tr>`
    : "";

  const linkHtml = trackingUrl
    ? `<tr>
              <td style="padding:20px 24px 0;">
                <a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:#ff2fb3;color:#ffffff;font-weight:700;text-transform:uppercase;text-decoration:none;padding:12px 22px;border:3px solid #0a0a0a;border-radius:999px;">
                  Suivre le colis →
                </a>
                <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:#5c5c5c;word-break:break-all;">
                  ${escapeHtml(trackingUrl)}
                </p>
                <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:#5c5c5c;">
                  Ou sur Brainrototo : <a href="${escapeHtml(commandeUrl)}" style="color:#0a0a0a;">voir ma commande</a>
                </p>
              </td>
            </tr>`
    : `<tr>
              <td style="padding:20px 24px 0;">
                <a href="${escapeHtml(commandeUrl)}" style="display:inline-block;background:#ff2fb3;color:#ffffff;font-weight:700;text-transform:uppercase;text-decoration:none;padding:12px 22px;border:3px solid #0a0a0a;border-radius:999px;">
                  Voir ma commande →
                </a>
              </td>
            </tr>`;

  return carrierHtml + codeHtml + linkHtml;
}

export function buildOrderShippedHtml(order: Order) {
  const { shipping } = order;
  const eta = orderEtaLabel("shipped");

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
                <h1 style="margin:0;font-size:28px;line-height:1.05;text-transform:uppercase;">Ton tee est parti</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:#3d3d3d;">
                  ${escapeHtml(shipping.name)}, le transporteur a pris en charge ta commande.
                </p>
                ${
                  eta
                    ? `<p style="margin:12px 0 0;font-size:14px;line-height:1.5;font-weight:700;color:#0a0a0a;">${escapeHtml(eta)}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 0;">
                <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;color:#7a7a7a;">Numéro de commande</p>
                <p style="margin:4px 0 0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(order.id)}</p>
              </td>
            </tr>
            ${trackingBlock(order)}
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

export function buildOrderShippedText(order: Order) {
  const trackingUrl =
    order.supplier.trackingUrl && isHttpUrl(order.supplier.trackingUrl)
      ? order.supplier.trackingUrl
      : null;
  const trackingCode = order.supplier.tracking;
  const carrier = order.supplier.carrier;
  const followUrl = orderFollowUrl(order.id);
  const eta = orderEtaLabel("shipped");
  const lines = [
    "Brainrototo - Ton tee est parti",
    "",
    `${order.shipping.name}, le transporteur a pris en charge ta commande.`,
  ];
  if (eta) lines.push(eta);
  lines.push("", `Commande ${order.id}`);
  if (carrier) lines.push(`Transporteur : ${carrier}`);
  if (trackingCode) lines.push(`N° de suivi : ${trackingCode}`);
  if (trackingUrl) lines.push(`Suivi colis : ${trackingUrl}`);
  lines.push(`Suivi Brainrototo : ${followUrl}`);
  lines.push("", `Contact : ${legal.email}`);
  return lines.join("\n");
}
