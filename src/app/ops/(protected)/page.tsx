import { OpsDashboard } from "@/features/ops/OpsDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops - Dashboard" };

export default function OpsDashboardPage() {
  return <OpsDashboard />;
}
