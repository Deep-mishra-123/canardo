import { NextResponse } from "next/server";
import { createContactMessage, StoreError } from "@/lib/store";
import { contactSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check your details and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    await createContactMessage(parsed.data);
    return NextResponse.json(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof StoreError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/contact", error);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }
}
