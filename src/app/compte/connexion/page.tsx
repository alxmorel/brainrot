import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/account/AuthForms";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
