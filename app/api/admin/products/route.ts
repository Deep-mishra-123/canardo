import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { StoreError, createProduct } from "@/lib/store";
import { productUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid product details" },
      { status: 422 },
    );
  }

  try {
    const product = await createProduct(parsed.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof StoreError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/admin/products", error);
    return NextResponse.json(
      { error: "Could not create product" },
      { status: 500 },
    );
  }
}
