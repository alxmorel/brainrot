import { NextResponse } from "next/server";
import { getOpsSessionDetail } from "@/server/ops/sessions";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  const session = await getOpsSessionDetail(decodeURIComponent(sessionId));
  if (!session) {
    return NextResponse.json({ ok: false, error: "Session introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, session });
}
