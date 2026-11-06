import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Droplets,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { LeafMark } from "@/components/brand/Logo";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getStorefrontItems } from "@/lib/store";

export const metadata = {
  title: "A Cleaner Home. A Fresher Everyday.",
  description:
    "Discover CANARDO Floor Care: six refreshing floor cleaner fragrances and a considered hand liquid wash for everyday care.",
};

const whyChoose = [
  {
    title: "Everyday Cleaning Essentials",
    description:
      "A focused collection for the floors and hands that carry your everyday life.",
    icon: Sparkles,
  },
  {
    title: "Six Refreshing Fragrances",
    description:
      "Vetiver, Sandalwood, Lavender, Pine, Jasmine and Bergamot — a fragrance for every mood.",
    icon: Leaf,
  },
  {
    title: "Quality-Focused Products",
    description:
      "Considered packaging, clear product details and a meticulous approach to presentation.",
    icon: ShieldCheck,
  },
  {
    title: "Convenient Online Ordering",
    description:
      "Choose a fragrance, set your quantity and place your order without creating an account.",
    icon: ShoppingBag,
  },
];

export default async function HomePage() {
  const products = await getStorefrontItems();
  const floorProducts = products.filter(
    (product) => product.category === "floor-cleaner",
  );
  const handWash = products.find((product) => product.category === "hand-wash");

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-line bg-offwhite">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[18rem] top-[18%] size-[38rem] rounded-full border border-forest/[0.05]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9rem] top-[32%] size-[20rem] rounded-full border border-forest/[0.06]"
        />

        <div className="container-page relative z-10 grid min-h-[calc(100svh-7.25rem)] items-center gap-12 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:py-20">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow text-forest/60">CANARDO Floor Care</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display-title mt-7 max-w-2xl text-[clamp(3.25rem,8vw,7.2rem)] text-forest">
                A Cleaner Home.
                <span className="block italic text-forest/70">A Fresher Everyday.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-lg text-[0.95rem] leading-7 text-charcoal/62 md:text-base md:leading-8">
                Discover premium cleaning essentials designed to bring freshness
                and cleanliness to your everyday life.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-forest px-8 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-forest-deep hover:shadow-float"
                >
                  Shop Now
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.8}
                  />
                </Link>
                <Link
                  href="/floor-cleaner"
                  className="group inline-flex h-13 items-center justify-center gap-3 rounded-full border border-forest/20 px-8 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-forest transition-all duration-300 hover:border-forest hover:bg-mint"
                >
                  Explore Products
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-6 text-[0.59rem] font-semibold uppercase tracking-[0.17em] text-stone">
                <span>Six fragrance expressions</span>
                <span className="size-1 rounded-full bg-forest/25" />
                <span>Floor care + hand care</span>
                <span className="size-1 rounded-full bg-forest/25" />
                <span>No account needed</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-[30rem]">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-full bg-mint/55 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[15rem_15rem_2rem_2rem] bg-forest px-10 pb-10 pt-16 text-white shadow-float">
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/5">
                      <LeafMark className="size-6 text-mint" />
                    </span>
                    <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                      The collection
                    </span>
                  </div>

                  <h2 className="mt-12 font-display text-[3.4rem] leading-[0.92] tracking-[-0.04em]">
                    Six fragrances.
                    <span className="block italic text-mint">One ritual.</span>
                  </h2>
                  <p className="mt-5 max-w-xs text-xs leading-6 text-white/55">
                    A fragrance wardrobe for your floors, composed for the
                    rhythm of everyday living.
                  </p>

                  <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/12 pt-7">
                    {floorProducts.map((product, index) => (
                      <Link
                        key={product.variantId}
                        href={`/product/${product.variantSlug}`}
                        className="group flex items-center gap-3 text-xs text-white/65 transition-colors hover:text-white"
                      >
                        <span className="text-[0.5rem] font-semibold tracking-[0.12em] text-white/30">
                          0{index + 1}
                        </span>
                        {product.fragrance}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/shop"
                    className="mt-9 inline-flex items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-mint transition-colors hover:text-white"
                  >
                    Explore the collection
                    <span className="flex size-8 items-center justify-center rounded-full border border-mint/30 transition-all group-hover:bg-mint group-hover:text-forest">
                      <ArrowRight className="size-3.5" strokeWidth={1.8} />
                    </span>
                  </Link>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute -right-24 -top-12 size-72 rounded-full border border-white/[0.07]"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-10 top-10 size-44 rounded-full border border-white/[0.07]"
                />
              </div>

              {handWash && (
                <Link
                  href={`/product/${handWash.variantSlug}`}
                  className="absolute -bottom-7 -left-10 flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-4 pr-5 shadow-card backdrop-blur transition-transform duration-500 hover:-translate-y-1"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-mint text-forest">
                    <Droplets className="size-5" strokeWidth={1.6} />
                  </span>
                  <span>
                    <span className="block text-[0.52rem] font-semibold uppercase tracking-[0.17em] text-stone">
                      New addition
                    </span>
                    <span className="mt-1 block font-display text-lg leading-none text-forest">
                      Hand Liquid Wash
                    </span>
                  </span>
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28" id="collection">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-line pb-9 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow text-forest/55">The CANARDO collection</p>
                <h2 className="display-title mt-5 max-w-2xl text-[clamp(2.6rem,5vw,4.8rem)] text-forest">
                  Considered essentials for everyday spaces.
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex shrink-0 items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.17em] text-forest"
              >
                Shop all products
                <span className="flex size-9 items-center justify-center rounded-full border border-forest/15 transition-colors group-hover:bg-forest group-hover:text-white">
                  <ArrowRight className="size-4" strokeWidth={1.7} />
                </span>
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.variantId} delay={(index % 4) * 60}>
                <ProductCard product={product} priority={index < 4} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-mint-soft py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-forest/[0.06]"
        />
        <div className="container-page relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center text-forest/55">Find your fragrance</p>
              <h2 className="display-title mt-5 text-[clamp(2.6rem,5vw,4.8rem)] text-forest">
                A scent for every kind of day.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-charcoal/60">
                From grounded and woody to bright and floral, the floor care
                collection moves with the mood of your home.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-forest/10 bg-forest/10 sm:grid-cols-2 lg:grid-cols-3">
            {floorProducts.map((product, index) => (
              <Link
                key={product.variantId}
                href={`/product/${product.variantSlug}`}
                className="group relative flex min-h-36 flex-col justify-between bg-offwhite p-7 transition-colors duration-500 hover:bg-white md:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[0.6rem] font-semibold tracking-[0.16em] text-stone">
                    0{index + 1}
                  </span>
                  <ArrowUpRight
                    className="size-4 -translate-y-1 translate-x-1 text-forest/30 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-forest"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="mt-10 flex items-end justify-between gap-4">
                  <h3 className="font-display text-3xl tracking-[-0.03em] text-forest">
                    {product.fragrance}
                  </h3>
                  <span className="text-[0.55rem] uppercase tracking-[0.15em] text-stone">
                    Floor Care
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="eyebrow text-forest/55">Why CANARDO</p>
                <h2 className="display-title mt-5 text-[clamp(2.6rem,5vw,4.8rem)] text-forest">
                  The details make the everyday.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-charcoal/60 lg:justify-self-end">
                CANARDO is built around a simple idea: the products you reach for
                every day deserve the same care as the things you save for
                special occasions.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="group h-full bg-offwhite p-7 transition-colors duration-500 hover:bg-mint-soft md:p-8">
                  <span className="flex size-11 items-center justify-center rounded-full border border-forest/12 bg-white text-forest transition-all duration-500 group-hover:bg-forest group-hover:text-white">
                    <item.icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="mt-8 block text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-stone">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 font-display text-[1.55rem] leading-tight tracking-[-0.02em] text-forest">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.78rem] leading-6 text-stone">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-offwhite pb-20 md:pb-28">
        <div className="container-page">
          <Reveal>
            <div className="grain relative overflow-hidden rounded-[2rem] bg-forest px-7 py-14 text-white md:px-14 md:py-20 lg:px-20">
              <div className="relative z-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <p className="eyebrow text-mint/70">The CANARDO point of view</p>
                  <h2 className="display-title mt-6 max-w-2xl text-[clamp(2.7rem,5.3vw,5.2rem)]">
                    Cleaning, considered.
                    <span className="block italic text-mint/80">Living, lighter.</span>
                  </h2>
                </div>
                <div>
                  <p className="text-sm leading-7 text-white/62">
                    We believe the everyday can feel more intentional. That is
                    why CANARDO pairs a focused product range with a quieter
                    visual language — clean lines, thoughtful details and a
                    fresh point of view.
                  </p>
                  <Link
                    href="/about"
                    className="group mt-8 inline-flex items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.17em] text-mint"
                  >
                    Our story
                    <span className="flex size-9 items-center justify-center rounded-full border border-mint/30 transition-colors group-hover:bg-mint group-hover:text-forest">
                      <ArrowRight className="size-4" strokeWidth={1.7} />
                    </span>
                  </Link>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute -right-36 -top-36 size-[30rem] rounded-full border border-white/[0.06]"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-44 right-24 size-[24rem] rounded-full border border-white/[0.05]"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
