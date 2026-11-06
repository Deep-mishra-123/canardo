import Link from "next/link";
import { ArrowRight, Clock3, Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with CANARDO Floor Care about products, orders or the collection.",
};

export default function ContactPage() {
  return (
    <div className="bg-offwhite pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="container-page">
        <nav
          aria-label="Breadcrumb"
          className="text-[0.62rem] uppercase tracking-[0.16em] text-stone"
        >
          <Link href="/" className="transition-colors hover:text-forest">
            Home
          </Link>
          <span className="mx-2 text-forest/25">/</span>
          <span className="text-forest">Contact</span>
        </nav>

        <div className="mt-10 grid gap-10 border-b border-line pb-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="eyebrow text-forest/55">Contact</p>
            <h1 className="display-title mt-5 max-w-3xl text-[clamp(3rem,6.5vw,6.4rem)] text-forest">
              Let&apos;s talk
              <span className="block italic text-forest/70">about the everyday.</span>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-charcoal/60 lg:justify-self-end">
            Questions about the collection, an order or a product detail? Send a
            message and it will be added to the CANARDO enquiries dashboard.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-14">
          <div className="space-y-4">
            <div className="rounded-[1.25rem] border border-line bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-mint text-forest">
                <MessageSquare className="size-4.5" strokeWidth={1.6} />
              </span>
              <h2 className="mt-5 font-display text-2xl text-forest">
                Product & order enquiries
              </h2>
              <p className="mt-2 text-xs leading-6 text-stone">
                Share as much detail as you can. For order enquiries, include your
                order number so we can find it quickly.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-line bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-mint text-forest">
                <Clock3 className="size-4.5" strokeWidth={1.6} />
              </span>
              <h2 className="mt-5 font-display text-2xl text-forest">
                A considered reply
              </h2>
              <p className="mt-2 text-xs leading-6 text-stone">
                Messages are reviewed in the order they arrive. The contact
                details you provide are used only to respond to your enquiry.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-forest p-6 text-white">
              <Mail className="size-5 text-mint" strokeWidth={1.6} />
              <p className="mt-4 font-display text-xl">Already ordered?</p>
              <p className="mt-2 text-xs leading-6 text-white/60">
                Keep your order number handy. It appears on your confirmation
                screen and in your order summary.
              </p>
              <Link
                href="/shop"
                className="group mt-5 inline-flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-mint"
              >
                Explore the collection
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
