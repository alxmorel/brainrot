import {
  claimConfirmationEmailSend,
  clearConfirmationEmailSend,
  getOrder,
} from "@/server/orders-repo";
import {
  buildOrderConfirmationHtml,
  buildOrderConfirmationText,
} from "@/server/email/orderConfirmationHtml";
import { emailFrom, getResend } from "@/server/email/resend";

function isValidEmail(email: string) {
  return email.length > 0 && email !== "—" && email.includes("@");
}

export async function trySendOrderConfirmation(orderId: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY manquant — confirmation non envoyée.");
    return;
  }

  const order = await getOrder(orderId);
  if (!order) return;

  const email = order.shipping.email.trim();
  if (!isValidEmail(email)) return;

  const claimed = await claimConfirmationEmailSend(orderId);
  if (!claimed) return;

  try {
    const { error } = await resend.emails.send({
      from: emailFrom(),
      to: email,
      subject: `Commande confirmée — ${order.id}`,
      html: buildOrderConfirmationHtml(order),
      text: buildOrderConfirmationText(order),
    });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    await clearConfirmationEmailSend(orderId);
    console.error("[email] Échec envoi confirmation commande:", orderId, error);
  }
}
