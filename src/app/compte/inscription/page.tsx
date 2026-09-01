import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/features/account/AuthForms";

export const metadata: Metadata = {
  title: "Créer un compte",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
