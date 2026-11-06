import Link from "next/link";
import { ArrowRight, Droplets, Leaf, ShieldCheck } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Reveal } from "@/components/ui/Reveal";
import { getStorefrontItems } from "@/lib/store";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Hand Liquid Wash",
  description:
    "Discover CANARDO Hand Liquid Wash — a considered everyday hand care essential in the CANARDO style.",
};

export default async function HandWashPage() {
  const handWash = (await getStorefrontItems()).find(
    (product) => product.category === "hand-wash",
  );

  if (!handWash) notFound();

  return (
    <div className="bg-offwhite">
      <section className="border-b border-line bg-mint-soft">
        <div className="container-page py-12 md:py-16">
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
            <span className="text-forest">Hand Liquid Wash</span>
          </nav>

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
            <Reveal>
              <div>
                <p className="eyebrow text-forest/55">CANARDO Hand Care</p>
                <h1 className="display-title mt-6 text-[clamp(3.4rem,7vw,6.6rem)] text-forest">
                  Care,
                  <span className="block italic text-forest/70">at hand.</span>
                </h1>
                <p className="mt-7 max-w-md text-sm leading-7 text-charcoal/62">
                  A quiet addition to the CANARDO collection. Hand Liquid Wash
                  brings the same considered approach to the small rituals that
                  shape your day.
                </p>

                <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
                  {[
                    { icon: Droplets, label: "Hand care" },
                    { icon: Leaf, label: "Everyday" },
                    { icon: ShieldCheck, label: "Considered" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-forest/10 bg-white/55 px-3 py-4 text-center"
                    >
                      <item.icon
                        className="mx-auto size-4 text-forest"
                        strokeWidth={1.6}
                      />
                      <p className="mt-2 text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-forest/60">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-card">
                <ProductImage
                  src={handWash.imageUrl}
                  alt={
                    handWash.isPlaceholderImage
                      ? "CANARDO Hand Liquid Wash concept visual"
                      : "CANARDO Hand Liquid Wash"
                  }
                  label="Hand Liquid Wash"
                  priority
                  className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]"
                />
                {handWash.isPlaceholderImage && (
                  <span className="absolute right-5 top-5 rounded-full bg-forest/88 px-3 py-2 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                    Concept visual
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal>
            <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-line bg-white">
              <ProductImage
                src={handWash.imageUrl}
                alt={
                  handWash.isPlaceholderImage
                    ? "CANARDO Hand Liquid Wash concept visual"
                    : "CANARDO Hand Liquid Wash"
                }
                label="Hand Liquid Wash"
                className="aspect-square w-full"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="lg:pt-6">
              <p className="eyebrow text-forest/55">The product</p>
              <h2 className="display-title mt-5 text-[clamp(2.8rem,5vw,4.7rem)] text-forest">
                {handWash.productName}
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-charcoal/62">
                {handWash.description}
              </p>

              <div className="mt-8 border-y border-line py-7">
                <ProductPurchase product={handWash} />
              </div>

              {handWash.isPlaceholderImage && (
                <div className="mt-6 rounded-2xl bg-mint-soft p-5">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-forest">
                    About the current image
                  </p>
                  <p className="mt-2 text-[0.72rem] leading-6 text-forest/65">
                    The current visual is a temporary concept placeholder. The
                    official CANARDO Hand Liquid Wash photograph will replace it
                    through the admin dashboard.
                  </p>
                </div>
              )}

              <Link
                href="/product/hand-liquid-wash"
                className="group mt-7 inline-flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-forest"
              >
                View full product page
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
