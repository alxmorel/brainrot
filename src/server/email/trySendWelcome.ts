import {
  buildWelcomeEmailHtml,
  buildWelcomeEmailText,
} from "@/server/email/welcomeHtml";
import { emailFrom, getResend } from "@/server/email/resend";
import type { ShopPublicSettings } from "@/models/shop";
import { DEFAULT_SHOP } from "@/models/shop";

export async function trySendWelcomeEmail(
  email: string,
  code: string,
  shop: ShopPublicSettings = DEFAULT_SHOP,
) {
  const resend = getResend();
  if (!resend) return false;
  try {
    const { error } = await resend.emails.send({
      from: emailFrom(),
      to: email,
      subject: "Ton code Brainrototo",
      html: buildWelcomeEmailHtml(code, shop),
      text: buildWelcomeEmailText(code, shop),
    });
    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    console.error("[email] Échec envoi welcome:", email, error);
    return false;
  }
}
