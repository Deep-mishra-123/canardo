import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { markContactMessageRead, StoreError } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  let body: { isRead?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.isRead !== "boolean") {
    return NextResponse.json({ error: "Invalid state" }, { status: 422 });
  }

  try {
    const updated = await markContactMessageRead(id, body.isRead);
    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof StoreError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PATCH /api/admin/messages/[id]", error);
    return NextResponse.json(
      { error: "Could not update message" },
      { status: 500 },
    );
  }
}
