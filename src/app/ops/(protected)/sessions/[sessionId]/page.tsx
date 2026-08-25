import { OpsSessionDetail } from "@/features/ops/OpsSessionDetail";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ops - Session" };

export default async function OpsSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <OpsSessionDetail sessionId={decodeURIComponent(sessionId)} />;
}
