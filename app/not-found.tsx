import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LeafMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-5 py-16 text-center">
      <LeafMark className="size-12 text-forest" />
      <p className="eyebrow mt-8 justify-center text-forest/50">404 — Page not found</p>
      <h1 className="display-title mt-4 text-[clamp(3rem,8vw,6rem)] text-forest">
        A little off course.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-7 text-charcoal/55">
        The page you are looking for may have moved, or the address may be
        incomplete. Let&apos;s take you back to something fresh.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest px-7 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-forest-deep"
        >
          <ArrowLeft className="size-4" strokeWidth={1.8} />
          Back home
        </Link>
        <Link
          href="/shop"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-forest/15 px-7 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-forest transition-colors hover:bg-mint"
        >
          Shop the collection
          <ArrowRight className="size-4" strokeWidth={1.8} />
        </Link>
      </div>
    </div>
  );
}
