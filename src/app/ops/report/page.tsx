import { OpsReport } from "@/features/ops/OpsReport";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops reporting — Brainrot" };

export default function Page() {
  return <OpsReport />;
}
