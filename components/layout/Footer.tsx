import Link from "next/link";
import { LeafMark, Logo } from "@/components/brand/Logo";

const shopLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/floor-cleaner", label: "Floor Cleaner" },
  { href: "/hand-liquid-wash", label: "Hand Liquid Wash" },
];

const brandLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Shopping Cart" },
];

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-forest text-white">
      <div className="container-page relative z-10 pb-8 pt-16 md:pb-10 md:pt-24">
        <div className="grid gap-14 border-b border-white/12 pb-14 md:grid-cols-[1.35fr_0.65fr_0.65fr] md:pb-20">
          <div className="max-w-md">
            <Logo tone="light" />
            <p className="mt-7 max-w-sm text-sm leading-7 text-white/62">
              Considered cleaning essentials for the rooms you live in.
              Six refreshing floor care fragrances and a quiet hand wash,
              designed around the everyday.
            </p>
            <div className="mt-9 flex items-center gap-3 text-white/50">
              <LeafMark className="size-7" />
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em]">
                A fresher everyday
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/45">
              Shop
            </h2>
            <ul className="mt-6 space-y-3.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/45">
              Brand
            </h2>
            <ul className="mt-6 space-y-3.5">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-[0.62rem] uppercase tracking-[0.15em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CANARDO Floor Care. All rights reserved.</p>
          <p>Household cleaning products · India</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -right-24 size-[32rem] rounded-full border border-white/8"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-8 size-[22rem] rounded-full border border-white/6"
      />
    </footer>
  );
}
