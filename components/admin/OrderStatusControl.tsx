"use client";

import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OrderStatusControl({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not update status.");
        return;
      }
      setMessage("Order status updated.");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="order-status"
        className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.12em] text-stone"
      >
        Update order status
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          id="order-status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as OrderStatus);
            setMessage("");
          }}
          className="h-10 flex-1 rounded-xl border border-line bg-white px-3 text-xs text-charcoal outline-none focus:border-forest"
        >
          {ORDER_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={save}
          disabled={saving || status === initialStatus}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[0.58rem] font-semibold uppercase tracking-[0.1em] transition-colors",
            "bg-forest text-white hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          {saving ? (
            <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
          ) : (
            <Check className="size-3.5" strokeWidth={2} />
          )}
          Save status
        </button>
      </div>
      {message && <p className="mt-2 text-[0.62rem] text-emerald-700">{message}</p>}
      {error && <p className="mt-2 text-[0.62rem] text-red-700">{error}</p>}
    </div>
  );
}
