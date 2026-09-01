import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountHome } from "@/features/account/AccountHome";
import { getSessionUser } from "@/server/get-session-user";
import { listOrdersByUserId } from "@/server/orders-repo";
import { buildPublicOrderView } from "@/server/orders/publicOrder";
import { accountMeOf } from "@/server/users-repo";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/compte/connexion");
  const orders = await listOrdersByUserId(user.id);
  return (
    <AccountHome
      user={await accountMeOf(user)}
      orders={orders.map(buildPublicOrderView)}
    />
  );
}
