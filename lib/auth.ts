import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin, getSupabasePublic, isSupabaseConfigured } from "@/lib/supabase";

const COOKIE_NAME = "canardo_admin";
const SESSION_HOURS = 8;

export type AdminSession = {
  email: string;
  expiresAt: number;
  mode: "supabase" | "local";
};

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "canardo-development-secret-change-this-before-deploying"
  );
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(email: string, mode: AdminSession["mode"]) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      mode,
      exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      mode?: string;
      exp?: number;
    };
    if (!parsed.email || !parsed.exp || parsed.exp < Date.now()) return null;
    if (parsed.mode !== "local" && parsed.mode !== "supabase") return null;
    return { email: parsed.email, expiresAt: parsed.exp, mode: parsed.mode };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function authenticateAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    const publicClient = getSupabasePublic();
    const adminClient = getSupabaseAdmin();
    if (!publicClient || !adminClient) {
      return { ok: false as const, error: "Authentication is not configured." };
    }

    const { data, error } = await publicClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      return { ok: false as const, error: "Incorrect email or password." };
    }

    const { data: adminUser, error: adminError } = await adminClient
      .from("admin_users")
      .select("user_id, email")
      .eq("user_id", data.user.id)
      .maybeSingle();

    await publicClient.auth.signOut();

    if (adminError || !adminUser) {
      return { ok: false as const, error: "This account does not have admin access." };
    }

    return {
      ok: true as const,
      mode: "supabase" as const,
      email: adminUser.email || normalizedEmail,
    };
  }

  const expectedEmail = (process.env.ADMIN_EMAIL || "admin@canardo.com").toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "change-this-password";

  if (
    safeEqual(normalizedEmail, expectedEmail) &&
    safeEqual(password, expectedPassword)
  ) {
    return { ok: true as const, mode: "local" as const, email: normalizedEmail };
  }

  return { ok: false as const, error: "Incorrect email or password." };
}

export async function setAdminSessionCookie(email: string, mode: AdminSession["mode"]) {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(email, mode), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
