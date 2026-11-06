import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  MessageSquareText,
  Phone,
  User,
} from "lucide-react";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ProductImage } from "@/components/product/ProductImage";
import { getOrderById } from "@/lib/store";
import { ORDER_STATUSES } from "@/lib/types";
import { formatOrderDate, formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Order Detail",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const statusIndex = ORDER_STATUSES.indexOf(order.status);
  const progressStatuses = ORDER_STATUSES.filter(
    (status) => status !== "Cancelled",
  );

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-stone transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.8} />
        Back to orders
      </Link>

      <div className="mt-5 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-forest/50">
            Order detail
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] text-forest md:text-5xl">
            {order.orderNumber}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-stone">
            <CalendarDays className="size-3.5" strokeWidth={1.7} />
            Placed {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} className="px-3 py-1.5" />
          <span className="font-display text-2xl text-forest">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      {order.status !== "Cancelled" && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            {progressStatuses.map((status, index) => {
              const complete = statusIndex >= index;
              return (
                <div key={status} className="flex flex-1 items-center gap-2 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-[0.5rem] font-bold ${
                        complete ? "bg-forest text-white" : "bg-line text-stone"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`hidden text-[0.5rem] font-semibold uppercase tracking-[0.07em] sm:block ${
                        complete ? "text-forest" : "text-stone"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  {index < progressStatuses.length - 1 && (
                    <span
                      className={`mb-4 h-px flex-1 ${
                        statusIndex > index ? "bg-forest" : "bg-line"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-forest">Items ordered</h2>
              <p className="mt-0.5 text-[0.6rem] text-stone">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1
                  ? "unit"
                  : "units"}{" "}
                across {order.items.length}{" "}
                {order.items.length === 1 ? "line" : "lines"}
              </p>
            </div>
            <div className="divide-y divide-line px-5">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <ProductImage
                    src={item.imageUrl}
                    alt={item.productName}
                    label={item.fragrance || item.productName}
                    className="size-16 shrink-0 rounded-xl"
                    compact
                  />
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg leading-tight text-forest">
                        {item.fragrance || item.productName}
                      </p>
                      <p className="mt-0.5 text-[0.6rem] text-stone">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-[0.55rem] uppercase tracking-[0.09em] text-stone">
                        {item.size || "Size not set"} · Qty {item.quantity} ·{" "}
                        {formatPrice(item.unitPrice)} each
                      </p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold text-charcoal">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line bg-offwhite/60 px-5 py-4">
              <div className="ml-auto max-w-xs space-y-2 text-xs">
                <div className="flex justify-between gap-6">
                  <span className="text-stone">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-stone">Delivery</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "Complimentary"
                      : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between gap-6 border-t border-line pt-2 font-semibold text-forest">
                  <span>Final total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </section>

          {order.notes && (
            <section className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center gap-2">
                <MessageSquareText className="size-4 text-forest" strokeWidth={1.7} />
                <h2 className="text-sm font-semibold text-forest">Order notes</h2>
              </div>
              <p className="mt-3 text-xs leading-6 text-charcoal/65">{order.notes}</p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-semibold text-forest">Update status</h2>
            <div className="mt-4">
              <OrderStatusControl orderId={order.id} initialStatus={order.status} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-semibold text-forest">Customer</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint-soft text-forest">
                  <User className="size-3.5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-stone">
                    Full name
                  </p>
                  <p className="mt-1 text-xs font-medium text-charcoal">
                    {order.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint-soft text-forest">
                  <Phone className="size-3.5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-stone">
                    Contact
                  </p>
                  <p className="mt-1 text-xs font-medium text-charcoal">
                    {order.mobile}
                  </p>
                  {order.whatsapp && (
                    <p className="mt-0.5 text-[0.62rem] text-stone">
                      WhatsApp: {order.whatsapp}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint-soft text-forest">
                  <MapPin className="size-3.5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-stone">
                    Delivery address
                  </p>
                  <p className="mt-1 text-xs leading-5 text-charcoal/70">
                    {order.address}
                    <br />
                    {order.city}, {order.state} — {order.pincode}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
