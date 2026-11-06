import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getStorefrontItems } from "@/lib/store";

export const metadata = {
  title: "Floor Cleaner",
  description:
    "Explore CANARDO Floor Cleaning Liquid in six refreshing fragrances: Vetiver, Sandalwood, Lavender, Pine, Jasmine and Bergamot.",
};

export default async function FloorCleanerPage() {
  const products = (await getStorefrontItems()).filter(
    (product) => product.category === "floor-cleaner",
  );

  return (
    <div className="bg-offwhite">
      <section className="relative overflow-hidden border-b border-line bg-mint-soft">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full border border-forest/[0.06]"
        />
        <div className="container-page relative z-10 py-12 md:py-20">
          <nav
            aria-label="Breadcrumb"
            className="text-[0.62rem] uppercase tracking-[0.16em] text-stone"
          >
            <Link href="/" className="transition-colors hover:text-forest">
              Home
            </Link>
            <span className="mx-2 text-forest/25">/</span>
            <Link href="/shop" className="transition-colors hover:text-forest">
              Shop
            </Link>
            <span className="mx-2 text-forest/25">/</span>
            <span className="text-forest">Floor Cleaner</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow text-forest/55">Floor Cleaning Liquid</p>
              <h1 className="display-title mt-6 max-w-3xl text-[clamp(3.1rem,7vw,6.8rem)] text-forest">
                Six fragrances.
                <span className="block italic text-forest/70">One cleaner floor.</span>
              </h1>
            </div>
            <div className="max-w-md lg:justify-self-end">
              <p className="text-sm leading-7 text-charcoal/62">
                A single floor care formula, expressed through six distinct
                fragrance moods. Choose a grounded Vetiver, a bright Bergamot,
                or anything in between.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-forest/55">
                {products.map((product) => (
                  <span key={product.variantId}>{product.fragrance}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-forest">
            The six fragrances
          </p>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone transition-colors hover:text-forest"
          >
            Shop all
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-1"
              strokeWidth={1.8}
            />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product, index) => (
            <Reveal key={product.variantId} delay={(index % 3) * 70}>
              <ProductCard product={product} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
