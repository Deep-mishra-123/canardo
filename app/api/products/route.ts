import { NextResponse } from "next/server";
import { getStorefrontItems } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getStorefrontItems();
    return NextResponse.json(
      { products },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/products", error);
    return NextResponse.json(
      { error: "Could not load products" },
      { status: 500 },
    );
  }
}
