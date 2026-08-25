import {
  claimShippingEmailSend,
  clearShippingEmailSend,
  getOrder,
} from "@/server/orders-repo";
import {
  buildOrderShippedHtml,
  buildOrderShippedText,
} from "@/server/email/orderShippedHtml";
import { emailFrom, getResend } from "@/server/email/resend";
import { isHttpUrl } from "@/server/fulfillment/gelatoWebhook";

function isValidEmail(email: string) {
  return email.length > 0 && email !== "—" && email.includes("@");
}

export async function trySendOrderShipped(orderId: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY manquant — expédition non envoyée.");
    return;
  }

  const order = await getOrder(orderId);
  if (!order) return;

  const trackingUrl = order.supplier.trackingUrl;
  if (!trackingUrl || !isHttpUrl(trackingUrl)) return;

  const email = order.shipping.email.trim();
  if (!isValidEmail(email)) return;

  const claimed = await claimShippingEmailSend(orderId);
  if (!claimed) return;

  try {
    const { error } = await resend.emails.send({
      from: emailFrom(),
      to: email,
      subject: `Ton tee est parti — ${order.id}`,
      html: buildOrderShippedHtml(order),
      text: buildOrderShippedText(order),
    });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    await clearShippingEmailSend(orderId);
    console.error("[email] Échec envoi expédition commande:", orderId, error);
  }
}
