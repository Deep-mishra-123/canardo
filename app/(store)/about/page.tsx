import Link from "next/link";
import { ArrowRight, Droplets, Leaf, Sparkles } from "lucide-react";
import { LeafMark } from "@/components/brand/Logo";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "About Us",
  description:
    "Learn about CANARDO Floor Care — a household cleaning brand built around considered essentials for everyday living.",
};

const principles = [
  {
    title: "A focused collection",
    text: "Two product families, seven considered expressions. We keep the range clear so choosing feels effortless.",
    icon: Leaf,
  },
  {
    title: "Everyday, elevated",
    text: "The objects you use most often deserve attention. CANARDO brings a quieter visual language to daily cleaning.",
    icon: Sparkles,
  },
  {
    title: "Clarity first",
    text: "Clear product details, straightforward ordering and no unnecessary steps between you and your home.",
    icon: Droplets,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-offwhite pb-20 md:pb-28">
      <section className="relative overflow-hidden border-b border-line bg-mint-soft">
        <div className="container-page relative z-10 py-12 md:py-20">
          <nav
            aria-label="Breadcrumb"
            className="text-[0.62rem] uppercase tracking-[0.16em] text-stone"
          >
            <Link href="/" className="transition-colors hover:text-forest">
              Home
            </Link>
            <span className="mx-2 text-forest/25">/</span>
            <span className="text-forest">About Us</span>
          </nav>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="eyebrow text-forest/55">About CANARDO</p>
              <h1 className="display-title mt-6 max-w-3xl text-[clamp(3.2rem,7vw,7rem)] text-forest">
                The everyday
                <span className="block italic text-forest/70">deserves care.</span>
              </h1>
            </div>
            <p className="max-w-md text-sm leading-7 text-charcoal/62 lg:justify-self-end">
              CANARDO Floor Care is a household cleaning brand built around a
              simple conviction: the essentials of daily life can feel considered,
              beautiful and clear.
            </p>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 top-1/2 size-[42rem] -translate-y-1/2 rounded-full border border-forest/[0.06]"
        />
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <div>
              <p className="eyebrow text-forest/55">Our point of view</p>
              <h2 className="display-title mt-5 text-[clamp(2.7rem,5vw,4.6rem)] text-forest">
                Cleaning, without the noise.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-2xl space-y-5 text-sm leading-8 text-charcoal/62">
              <p>
                We believe a cleaning product should feel at home in the space it
                cares for. That is why CANARDO pairs a focused product range with
                restrained design — deep forest green, soft mint, clean
                off-white, and nothing that does not need to be there.
              </p>
              <p>
                The collection begins with floor care in six fragrance
                expressions: Vetiver, Sandalwood, Lavender, Pine, Jasmine and
                Bergamot. The Hand Liquid Wash extends the same considered
                approach to the sink.
              </p>
              <p>
                Our aim is not to make cleaning feel complicated. It is to make
                the products you reach for every day feel a little more
                intentional.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page">
        <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-3">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 60}>
              <div className="h-full bg-white p-7 md:p-8">
                <span className="flex size-10 items-center justify-center rounded-full bg-mint text-forest">
                  <principle.icon className="size-4.5" strokeWidth={1.6} />
                </span>
                <p className="mt-7 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-stone">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-display text-2xl text-forest">
                  {principle.title}
                </h3>
                <p className="mt-3 text-xs leading-6 text-stone">{principle.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-16 md:mt-24">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] bg-forest px-7 py-14 text-white md:px-14 md:py-20">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <LeafMark className="mx-auto size-10 text-mint" />
              <h2 className="display-title mt-6 text-[clamp(2.8rem,5.5vw,5.2rem)]">
                A cleaner home.
                <span className="block italic text-mint/80">A fresher everyday.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/58">
                Explore the full CANARDO collection and find the fragrance that
                fits the rhythm of your home.
              </p>
              <Link
                href="/shop"
                className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-mint px-7 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-forest transition-colors hover:bg-white"
              >
                Shop the collection
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
            <div
              aria-hidden="true"
              className="absolute -left-40 -top-48 size-[34rem] rounded-full border border-white/[0.06]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -right-24 size-[28rem] rounded-full border border-white/[0.05]"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
