import { cookies } from "next/headers";
import { userCookieName, userIdFromToken } from "@/server/auth-session";
import { getUserById } from "@/server/users-repo";

export async function getSessionUser() {
  const token = (await cookies()).get(userCookieName())?.value;
  const userId = await userIdFromToken(token);
  if (!userId) return null;
  return getUserById(userId);
}
