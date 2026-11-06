import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  MessageSquare,
  Package,
  TriangleAlert,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { listContactMessages, listOrders, listProducts } from "@/lib/store";
import { formatOrderDate, formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Overview",
};

export default async function AdminOverviewPage() {
  const [orders, products, messages] = await Promise.all([
    listOrders(),
    listProducts(true),
    listContactMessages(),
  ]);

  const activeOrders = orders.filter((order) => order.status !== "Cancelled");
  const newOrders = orders.filter((order) => order.status === "New").length;
  const inProgress = orders.filter((order) =>
    ["Confirmed", "Processing", "Shipped"].includes(order.status),
  ).length;
  const delivered = orders.filter((order) => order.status === "Delivered").length;
  const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const variants = products.flatMap((product) => product.variants);
  const pendingPrices = variants.filter(
    (variant) => variant.price === null || variant.price <= 0,
  ).length;
  const unreadMessages = messages.filter((message) => !message.isRead).length;
  const recentOrders = orders.slice(0, 6);

  const stats = [
    {
      label: "Total orders",
      value: String(orders.length),
      detail: `${newOrders} new`,
      icon: ClipboardList,
    },
    {
      label: "In progress",
      value: String(inProgress),
      detail: `${delivered} delivered`,
      icon: Package,
    },
    {
      label: "Order value",
      value: formatPrice(revenue),
      detail: "Excludes cancelled",
      icon: IndianRupee,
    },
    {
      label: "Messages",
      value: String(messages.length),
      detail: `${unreadMessages} unread`,
      icon: MessageSquare,
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-forest/50">
            Dashboard
          </p>
          <h1 className="display-title mt-2 text-4xl text-forest md:text-5xl">
            Store overview.
          </h1>
          <p className="mt-2 text-xs text-charcoal/50">
            Orders, products and customer messages at a glance.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex h-10 items-center gap-2 self-start rounded-full bg-forest px-5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-forest-deep sm:self-auto"
        >
          View all orders
          <ArrowRight className="size-3.5" strokeWidth={1.8} />
        </Link>
      </div>

      {(pendingPrices > 0 || products.some((product) => product.isPlaceholderImage)) && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-700" strokeWidth={1.7} />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Your catalogue needs a little attention
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-800/75">
                {pendingPrices > 0 &&
                  `${pendingPrices} ${pendingPrices === 1 ? "variant needs" : "variants need"} a price and size. `}
                {products.some((product) => product.isPlaceholderImage) &&
                  "The Hand Liquid Wash still uses a concept image. "}
                Online ordering is available once each variant has a price.
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-900 px-4 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white sm:mt-0"
          >
            Manage products
            <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-line bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-stone">
                {stat.label}
              </span>
              <span className="flex size-8 items-center justify-center rounded-full bg-mint-soft text-forest">
                <stat.icon className="size-4" strokeWidth={1.7} />
              </span>
            </div>
            <p className="mt-4 font-display text-3xl tracking-[-0.03em] text-forest">
              {stat.value}
            </p>
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.08em] text-stone">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-forest">Recent orders</h2>
              <p className="mt-0.5 text-[0.6rem] text-stone">
                The latest activity from your storefront.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-forest hover:opacity-70"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-mint-soft text-forest">
                <ClipboardList className="size-5" strokeWidth={1.5} />
              </span>
              <p className="mt-4 text-sm font-semibold text-forest">No orders yet</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-stone">
                Once a customer completes checkout, their order will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left">
                <thead>
                  <tr className="border-b border-line bg-offwhite/50 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-stone">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="group text-xs">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-semibold text-forest hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-charcoal">{order.customerName}</p>
                        <p className="mt-0.5 text-[0.58rem] text-stone">{order.mobile}</p>
                      </td>
                      <td className="px-5 py-4 text-[0.62rem] text-stone">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-charcoal">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-forest">Catalogue</h2>
              <p className="mt-0.5 text-[0.6rem] text-stone">
                {products.length} products · {variants.length} variants
              </p>
            </div>
            <Package className="size-4 text-forest/40" strokeWidth={1.7} />
          </div>

          <div className="mt-5 space-y-3">
            {products.map((product) => {
              const activeVariants = product.variants.filter(
                (variant) => variant.isActive,
              ).length;
              const ready = product.variants.filter(
                (variant) => variant.price !== null && variant.price > 0,
              ).length;
              return (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="group block rounded-xl border border-line p-4 transition-colors hover:border-forest/20 hover:bg-mint-soft/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-forest">{product.name}</p>
                      <p className="mt-1 text-[0.58rem] text-stone">
                        {activeVariants} active · {ready} priced
                      </p>
                    </div>
                    <ArrowUpRight
                      className="size-3.5 text-forest/30 transition-colors group-hover:text-forest"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-forest/60 transition-all"
                      style={{
                        width: `${Math.round((ready / Math.max(1, product.variants.length)) * 100)}%`,
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl bg-mint-soft p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-forest" strokeWidth={1.8} />
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-forest">
                Storefront live
              </p>
            </div>
            <p className="mt-1.5 text-[0.65rem] leading-5 text-forest/60">
              Customer ordering is available for every variant with a price.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
