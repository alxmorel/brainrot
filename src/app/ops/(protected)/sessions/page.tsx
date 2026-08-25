import { OpsSessionsList } from "@/features/ops/OpsSessionsList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops - Sessions" };

export default function OpsSessionsPage() {
  return <OpsSessionsList />;
}
