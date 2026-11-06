"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="bg-forest text-white">
        <div className="container-page flex h-9 items-center justify-center text-center">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-[0.65rem]">
            Thoughtfully considered essentials for everyday cleaning
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-forest/8 bg-offwhite/92 backdrop-blur-xl">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-5 md:h-20">
          <Logo />

          <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-[0.71rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                    active ? "text-forest" : "text-charcoal/70 hover:text-forest",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-forest transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/cart"
              aria-label={`Shopping cart${
                hydrated && itemCount > 0
                  ? `, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
                  : ""
              }`}
              className="relative flex size-11 items-center justify-center rounded-full text-forest transition-colors hover:bg-mint"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.6} />
              {hydrated && itemCount > 0 && (
                <span className="absolute right-1 top-1 flex min-w-[1.15rem] items-center justify-center rounded-full bg-forest px-1 py-0.5 text-[0.58rem] font-bold leading-none text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex size-11 items-center justify-center rounded-full text-forest transition-colors hover:bg-mint md:hidden"
            >
              <Menu className="size-5" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-offwhite md:hidden">
          <div className="container-page flex h-[4.5rem] items-center justify-between border-b border-line">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex size-11 items-center justify-center rounded-full text-forest hover:bg-mint"
            >
              <X className="size-5" strokeWidth={1.7} />
            </button>
          </div>
          <nav
            aria-label="Mobile navigation"
            className="container-page flex flex-1 flex-col justify-center gap-1 pb-16"
          >
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between border-b border-line py-6"
              >
                <span className="font-display text-4xl tracking-[-0.03em] text-forest">
                  {link.label}
                </span>
                <span className="text-[0.62rem] font-semibold tracking-[0.18em] text-stone">
                  0{index + 1}
                </span>
              </Link>
            ))}
            <Link
              href="/cart"
              className="mt-8 flex items-center justify-between rounded-full bg-forest px-6 py-4 text-sm font-semibold text-white"
            >
              Shopping Cart
              <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-xs">
                {hydrated ? itemCount : 0}
              </span>
            </Link>
          </nav>
          <div className="container-page pb-8 text-[0.62rem] uppercase tracking-[0.2em] text-stone">
            CANARDO Floor Care · Everyday freshness
          </div>
        </div>
      )}
    </>
  );
}
