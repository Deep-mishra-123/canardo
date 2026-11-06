import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, PackageCheck } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { getOrderConfirmation } from "@/lib/store";
import { formatOrderDate, formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Order Confirmed",
  description: "Your CANARDO Floor Care order confirmation.",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderNumber } = await params;
  const { token } = await searchParams;
  if (!token) notFound();

  const order = await getOrderConfirmation(orderNumber, token);
  if (!order) notFound();

  return (
    <div className="bg-offwhite pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-forest text-white shadow-card">
              <Check className="size-7" strokeWidth={2} />
            </span>
            <p className="eyebrow mt-7 justify-center text-forest/55">
              Order confirmed
            </p>
            <h1 className="display-title mt-4 text-[clamp(2.9rem,6vw,5.4rem)] text-forest">
              Thank you, {order.customerName.split(" ")[0]}.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-charcoal/60">
              Your order has been received. Please keep your order number handy —
              our team will use the contact details you provided to confirm your
              delivery.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-5 text-center">
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-stone">
                Order number
              </p>
              <p className="mt-2 text-sm font-semibold tracking-[0.04em] text-forest">
                {order.orderNumber}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 text-center">
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-stone">
                Order date
              </p>
              <p className="mt-2 text-sm font-medium text-charcoal">
                {formatOrderDate(order.createdAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 text-center">
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-stone">
                Status
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                <PackageCheck className="size-4" strokeWidth={1.8} />
                {order.status}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-6 py-5 md:px-8">
              <h2 className="text-sm font-semibold text-forest">Order summary</h2>
              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-stone">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="divide-y divide-line px-6 md:px-8">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-5">
                  <ProductImage
                    src={item.imageUrl}
                    alt={item.productName}
                    label={item.fragrance || item.productName}
                    className="size-20 shrink-0 rounded-xl"
                    compact
                  />
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl text-forest">
                        {item.fragrance || item.productName}
                      </h3>
                      <p className="mt-0.5 text-[0.65rem] text-stone">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-[0.6rem] uppercase tracking-[0.1em] text-stone">
                        {item.size || "Size to be confirmed"} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-forest">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line bg-offwhite/60 px-6 py-5 md:px-8">
              <div className="ml-auto max-w-xs space-y-2.5 text-sm">
                <div className="flex justify-between gap-6">
                  <span className="text-charcoal/60">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-charcoal/60">Delivery</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "Complimentary"
                      : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between gap-6 border-t border-line pt-3 font-semibold text-forest">
                  <span>Final total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-line bg-white p-6">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-stone">
                Delivering to
              </p>
              <p className="mt-3 text-sm font-semibold text-forest">
                {order.customerName}
              </p>
              <p className="mt-1 text-xs leading-6 text-charcoal/60">
                {order.address}
                <br />
                {order.city}, {order.state} — {order.pincode}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-line bg-white p-6">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-stone">
                Contact
              </p>
              <p className="mt-3 text-sm font-semibold text-forest">{order.mobile}</p>
              {order.whatsapp && (
                <p className="mt-1 text-xs text-charcoal/60">
                  WhatsApp: {order.whatsapp}
                </p>
              )}
              {order.notes && (
                <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-charcoal/60">
                  Note: {order.notes}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-forest px-7 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-forest-deep"
            >
              Continue shopping
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-forest/15 px-7 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-forest transition-colors hover:bg-mint"
            >
              Back to home
            </Link>
          </div>

          <p className="mt-8 text-center text-[0.6rem] leading-5 text-stone">
            Need help with this order? Please reference {order.orderNumber} in
            any communication with CANARDO Floor Care.
          </p>
        </div>
      </div>
    </div>
  );
}
