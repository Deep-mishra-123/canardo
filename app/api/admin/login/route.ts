import { NextResponse } from "next/server";
import {
  authenticateAdmin,
  clearAdminSessionCookie,
  setAdminSessionCookie,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
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
  const limit = rateLimit(`admin-login:${clientIp(request)}`, 6, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid details" },
      { status: 422 },
    );
  }

  const result = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  await setAdminSessionCookie(result.email, result.mode);
  return NextResponse.json(
    { ok: true, email: result.email, mode: result.mode },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
