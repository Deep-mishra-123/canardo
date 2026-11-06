"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
} from "lucide-react";
import { useState } from "react";
import { LeafMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export function AdminNav({
  email,
  mode,
}: {
  email: string;
  mode: "local" | "supabase";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(item: (typeof navigation)[number]) {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col bg-forest px-5 py-7 text-white lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <span className="flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/5">
            <LeafMark className="size-6 text-mint" />
          </span>
          <span>
            <span className="block font-display text-xl tracking-[0.15em]">CANARDO</span>
            <span className="mt-0.5 block text-[0.44rem] font-semibold tracking-[0.36em] text-white/45">
              ADMIN
            </span>
          </span>
        </Link>

        <nav className="mt-12 space-y-1" aria-label="Admin navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-medium transition-colors",
                isActive(item)
                  ? "bg-white/[0.09] text-white"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              <item.icon className="size-4" strokeWidth={1.7} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link
            href="/"
            target="_blank"
            className="mb-5 flex items-center justify-between rounded-xl border border-white/10 px-3.5 py-3 text-[0.62rem] font-medium text-white/55 transition-colors hover:border-white/20 hover:text-white"
          >
            View storefront
            <ExternalLink className="size-3.5" strokeWidth={1.7} />
          </Link>

          <div className="rounded-xl bg-white/[0.055] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[0.48rem] font-semibold uppercase tracking-[0.16em] text-white/35">
                {mode === "supabase" ? "Supabase" : "Local demo"}
              </span>
              <span className="size-1.5 rounded-full bg-mint" />
            </div>
            <p className="mt-2 truncate text-[0.68rem] text-white/70">{email}</p>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="mt-3 inline-flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/45 transition-colors hover:text-white disabled:opacity-50"
            >
              <LogOut className="size-3.5" strokeWidth={1.8} />
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <LeafMark className="size-7 text-forest" />
            <span className="font-display text-lg tracking-[0.14em] text-forest">
              CANARDO
            </span>
            <span className="rounded-full bg-mint px-2 py-1 text-[0.45rem] font-semibold uppercase tracking-[0.12em] text-forest">
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            aria-label="Sign out"
            className="flex size-9 items-center justify-center rounded-full text-forest hover:bg-mint"
          >
            <LogOut className="size-4" strokeWidth={1.7} />
          </button>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-line px-3 py-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.09em] transition-colors",
                isActive(item)
                  ? "bg-forest text-white"
                  : "text-charcoal/55 hover:bg-mint-soft",
              )}
            >
              <item.icon className="size-3.5" strokeWidth={1.7} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
