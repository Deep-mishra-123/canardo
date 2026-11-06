"use client";

import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { cn, formatOrderDate, formatPrice } from "@/lib/utils";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | OrderStatus>("All");

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = status === "All" || order.status === status;
      const matchesQuery =
        !normalized ||
        order.orderNumber.toLowerCase().includes(normalized) ||
        order.customerName.toLowerCase().includes(normalized) ||
        order.mobile.toLowerCase().includes(normalized) ||
        order.city.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, status]);

  return (
    <>
      <div className="flex flex-col gap-3 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {(["All", ...ORDER_STATUSES] as const).map((option) => {
            const count =
              option === "All"
                ? orders.length
                : orders.filter((order) => order.status === option).length;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-[0.56rem] font-semibold uppercase tracking-[0.08em] transition-colors",
                  status === option
                    ? "border-forest bg-forest text-white"
                    : "border-line bg-white text-charcoal/55 hover:border-forest/20 hover:text-forest",
                )}
              >
                {option}
                <span
                  className={cn(
                    "ml-1.5",
                    status === option ? "text-white/50" : "text-stone",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:w-72">
          <span className="sr-only">Search orders</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-stone"
            strokeWidth={1.8}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order, name, phone, city"
            className="h-10 w-full rounded-full border border-line bg-white pl-10 pr-4 text-xs text-charcoal outline-none placeholder:text-stone/60 focus:border-forest"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-forest">No matching orders</p>
          <p className="mt-1 text-xs text-stone">
            Try a different status or clear your search.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-line bg-white md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[54rem] text-left">
                <thead>
                  <tr className="border-b border-line bg-offwhite/60 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-stone">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Delivery</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visible.map((order) => (
                    <tr key={order.id} className="text-xs transition-colors hover:bg-mint-soft/30">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-semibold text-forest hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="mt-0.5 text-[0.55rem] text-stone">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                          {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1
                            ? "item"
                            : "items"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-charcoal">{order.customerName}</p>
                        <p className="mt-0.5 text-[0.58rem] text-stone">{order.mobile}</p>
                      </td>
                      <td className="px-5 py-4 text-[0.62rem] text-stone">
                        {order.city}, {order.state}
                        <br />
                        {order.pincode}
                      </td>
                      <td className="px-5 py-4 text-[0.6rem] text-stone">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-charcoal">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label={`View ${order.orderNumber}`}
                          className="inline-flex size-8 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-forest hover:text-white"
                        >
                          <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 space-y-3 md:hidden">
            {visible.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-2xl border border-line bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-forest">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-sm font-medium text-charcoal">
                      {order.customerName}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                  <div>
                    <p className="text-[0.58rem] text-stone">{order.mobile}</p>
                    <p className="mt-0.5 text-[0.58rem] text-stone">
                      {order.city} · {order.pincode}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-charcoal">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
