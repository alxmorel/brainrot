import {
  claimDeliveredEmailSend,
  clearDeliveredEmailSend,
  getOrder,
} from "@/server/orders-repo";
import {
  buildOrderDeliveredHtml,
  buildOrderDeliveredText,
} from "@/server/email/orderDeliveredHtml";
import { emailFrom, getResend } from "@/server/email/resend";

function isValidEmail(email: string) {
  return email.length > 0 && email !== "-" && email.includes("@");
}

export async function trySendOrderDelivered(orderId: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY manquant - livraison non envoyée.");
    return false;
  }

  const order = await getOrder(orderId);
  if (!order || order.status !== "delivered") return false;

  const email = order.shipping.email.trim();
  if (!isValidEmail(email)) return false;

  const claimed = await claimDeliveredEmailSend(orderId);
  if (!claimed) return false;

  try {
    const { error } = await resend.emails.send({
      from: emailFrom(),
      to: email,
      subject: `Ton tee est arrivé - ${order.id}`,
      html: buildOrderDeliveredHtml(order),
      text: buildOrderDeliveredText(order),
    });
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    await clearDeliveredEmailSend(orderId);
    console.error("[email] Échec envoi livraison commande:", orderId, error);
    return false;
  }
}
