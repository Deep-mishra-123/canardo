import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ShopGrid } from "@/components/product/ShopGrid";
import { getStorefrontItems } from "@/lib/store";

export const metadata = {
  title: "Shop All Products",
  description:
    "Explore the complete CANARDO Floor Care collection — six floor cleaner fragrances and a considered hand liquid wash.",
};

export default async function ShopPage() {
  const products = await getStorefrontItems();

  return (
    <div className="bg-offwhite pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="container-page">
        <nav aria-label="Breadcrumb" className="text-[0.62rem] uppercase tracking-[0.16em] text-stone">
          <Link href="/" className="transition-colors hover:text-forest">
            Home
          </Link>
          <span className="mx-2 text-forest/25">/</span>
          <span className="text-forest">Shop</span>
        </nav>

        <div className="mt-10 grid gap-8 border-b border-line pb-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <p className="eyebrow text-forest/70">The full collection</p>
            <h1 className="display-title mt-5 max-w-3xl text-[clamp(3rem,6.5vw,6.4rem)] text-forest">
              Everyday essentials,
              <span className="block italic text-forest/70">beautifully considered.</span>
            </h1>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-7 text-charcoal/70">
              Six floor care fragrances and one quiet hand wash. Choose the
              expression that fits your home, your mood and your everyday.
            </p>
            <Link
              href="/floor-cleaner"
              className="group mt-5 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-forest"
            >
              Start with floor care
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <ShopGrid products={products} />
        </div>
      </div>
    </div>
  );
}
