import { OpsLoginForm } from "@/features/ops/OpsLoginForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Ops login - Brainrototo" };

export default function Page() {
  return (
    <Suspense>
      <OpsLoginForm />
    </Suspense>
  );
}
