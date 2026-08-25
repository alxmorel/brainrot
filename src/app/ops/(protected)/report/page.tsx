import { OpsReport } from "@/features/ops/OpsReport";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops - Analytics" };

export default function OpsReportPage() {
  return <OpsReport />;
}
