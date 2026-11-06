import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { StoreError, updateOrderStatus } from "@/lib/store";
import { statusSchema } from "@/lib/validation";

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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 422 });
  }

  try {
    const order = await updateOrderStatus(id, parsed.data.status);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, status: order.status });
  } catch (error) {
    if (error instanceof StoreError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PATCH /api/admin/orders/[id]", error);
    return NextResponse.json(
      { error: "Could not update order status" },
      { status: 500 },
    );
  }
}
