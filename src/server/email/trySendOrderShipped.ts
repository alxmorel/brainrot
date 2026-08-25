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
import { hasShippableTracking } from "@/server/orders/shipOrder";

function isValidEmail(email: string) {
  return email.length > 0 && email !== "-" && email.includes("@");
}

export async function trySendOrderShipped(orderId: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY manquant - expédition non envoyée.");
    return false;
  }

  const order = await getOrder(orderId);
  if (!order || !hasShippableTracking(order)) return false;

  const email = order.shipping.email.trim();
  if (!isValidEmail(email)) return false;

  const claimed = await claimShippingEmailSend(orderId);
  if (!claimed) return false;

  try {
    const { error } = await resend.emails.send({
      from: emailFrom(),
      to: email,
      subject: `Ton tee est parti - ${order.id}`,
      html: buildOrderShippedHtml(order),
      text: buildOrderShippedText(order),
    });
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    await clearShippingEmailSend(orderId);
    console.error("[email] Échec envoi expédition commande:", orderId, error);
    return false;
  }
}
