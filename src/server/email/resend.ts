import { Resend } from "resend";

let client: Resend | null = null;

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) {
    client = new Resend(key);
  }
  return client;
}

export function emailFrom() {
  return process.env.EMAIL_FROM ?? "Brainrototo <onboarding@resend.dev>";
}
