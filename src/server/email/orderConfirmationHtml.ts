import { brainrots } from "@/data/brainrots";
import { legal } from "@/data/legal";
import { customProductNote, formatEur, shippingNote, teePriceCents } from "@/data/pricing";
import { teeColorLabel } from "@/data/teeColors";
import type { Order } from "@/models";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildOrderConfirmationHtml(order: Order) {
  const lines = order.items.map((item) => {
    const brainrot = brainrots.find((b) => b.id === item.brainrotId);
    const name = brainrot?.name ?? item.brainrotId;
    const lineCents = item.quantity * teePriceCents;
    return {
      name,
      meta: `${item.size} · ${teeColorLabel(item.color)} · ×${item.quantity}`,
      lineCents,
    };
  });
  const totalCents = lines.reduce((sum, line) => sum + line.lineCents, 0);
  const { shipping } = order;

  const itemsHtml = lines
    .map(
      (line) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e8e6e0;">
            <strong style="font-size:15px;color:#0a0a0a;">${escapeHtml(line.name)}</strong><br />
            <span style="font-size:13px;color:#5c5c5c;">${escapeHtml(line.meta)}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e8e6e0;text-align:right;white-space:nowrap;font-weight:700;color:#0a0a0a;">
            ${escapeHtml(formatEur(line.lineCents))}
          </td>
        </tr>`,
    )
    .join("");

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
                <h1 style="margin:0;font-size:28px;line-height:1.05;text-transform:uppercase;">C’est commandé</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:#3d3d3d;">
                  Merci ${escapeHtml(shipping.name)} - on prépare ton tee. Voici le récap de ta commande.
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
              <td style="padding:16px 24px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${itemsHtml}
                  <tr>
                    <td style="padding:16px 0 0;font-size:16px;font-weight:700;text-transform:uppercase;">Total</td>
                    <td style="padding:16px 0 0;text-align:right;font-size:16px;font-weight:700;">${escapeHtml(formatEur(totalCents))} TTC</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 0;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;color:#7a7a7a;">Livraison</p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#3d3d3d;">
                  ${escapeHtml(shipping.name)}<br />
                  ${escapeHtml(shipping.line1)}<br />
                  ${escapeHtml(shipping.postalCode)} ${escapeHtml(shipping.city)}<br />
                  ${escapeHtml(shipping.country)}
                </p>
                <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:#5c5c5c;">
                  ${escapeHtml(shippingNote)} · ${escapeHtml(legal.deliveryEstimate)}
                </p>
                <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:#5c5c5c;">
                  ${escapeHtml(legal.trackingFollowUp)}
                </p>
                <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:#5c5c5c;">
                  Suivi en ligne : <a href="${escapeHtml(legal.siteUrl)}/commande" style="color:#0a0a0a;">${escapeHtml(legal.siteUrl)}/commande</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 28px;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:#5c5c5c;">
                  ${escapeHtml(customProductNote)}<br />
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

export function buildOrderConfirmationText(order: Order) {
  const lines = order.items.map((item) => {
    const brainrot = brainrots.find((b) => b.id === item.brainrotId);
    const name = brainrot?.name ?? item.brainrotId;
    const lineCents = item.quantity * teePriceCents;
    return `• ${name} - ${item.size} · ${teeColorLabel(item.color)} · ×${item.quantity} - ${formatEur(lineCents)}`;
  });
  const totalCents = order.items.reduce(
    (sum, item) => sum + item.quantity * teePriceCents,
    0,
  );
  const { shipping } = order;

  return [
    "Brainrototo - C’est commandé",
    "",
    `Merci ${shipping.name} - on prépare ton tee.`,
    "",
    `Commande ${order.id}`,
    "",
    ...lines,
    "",
    `Total : ${formatEur(totalCents)} TTC`,
    "",
    "Livraison",
    shipping.name,
    shipping.line1,
    `${shipping.postalCode} ${shipping.city}`,
    shipping.country,
    "",
    `${shippingNote} · ${legal.deliveryEstimate}`,
    legal.trackingFollowUp,
    `Suivi : ${legal.siteUrl}/commande`,
    "",
    customProductNote,
    `Contact : ${legal.email}`,
  ].join("\n");
}
