"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { checkoutSchema } from "@/lib/validation";
import { formatPrice } from "@/lib/utils";

type FormState = {
  customerName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const initialForm: FormState = {
  customerName: "",
  mobile: "",
  whatsapp: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

const fields = [
  { key: "customerName", label: "Full Name", placeholder: "Your full name", autoComplete: "name", type: "text" },
  { key: "mobile", label: "Mobile Number", placeholder: "10-digit mobile number", autoComplete: "tel", type: "tel" },
  { key: "whatsapp", label: "WhatsApp Number (optional)", placeholder: "If different from mobile", autoComplete: "tel", type: "tel" },
  { key: "city", label: "City", placeholder: "City", autoComplete: "address-level2", type: "text" },
  { key: "state", label: "State", placeholder: "State", autoComplete: "address-level1", type: "text" },
  { key: "pincode", label: "PIN Code", placeholder: "6-digit PIN code", autoComplete: "postal-code", type: "text" },
] as const;

export function CheckoutView() {
  const router = useRouter();
  const { lines, hydrated, subtotal, deliveryFee, total, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) {
    return (
      <div className="container-page py-20">
        <div className="h-10 w-64 animate-pulse rounded-full bg-mint" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-3xl bg-white" />
          <div className="h-96 animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full border border-forest/10 bg-mint-soft text-forest">
          <ShoppingBag className="size-8" strokeWidth={1.3} />
        </span>
        <h1 className="display-title mt-7 text-[clamp(2.5rem,5vw,4rem)] text-forest">
          Nothing to checkout yet.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-7 text-charcoal/55">
          Add a floor care fragrance or the Hand Liquid Wash to begin your order.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-forest px-7 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-forest-deep"
        >
          Shop the collection
          <ArrowRight className="size-4" strokeWidth={1.8} />
        </Link>
      </div>
    );
  }

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setErrors({});

    const payload = {
      ...form,
      items: lines.map(({ line }) => ({
        variantId: line.variantId,
        quantity: line.quantity,
      })),
    };

    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      const firstKey = Object.keys(nextErrors)[0];
      if (firstKey) {
        document.getElementById(`checkout-${firstKey}`)?.focus();
      }
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.error || "Could not place your order. Please try again.");
        return;
      }

      clearCart();
      router.push(
        `/order-confirmation/${data.order.orderNumber}?token=${data.order.confirmationToken}`,
      );
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10 md:py-14">
      <nav
        aria-label="Breadcrumb"
        className="text-[0.62rem] uppercase tracking-[0.15em] text-stone"
      >
        <Link href="/cart" className="transition-colors hover:text-forest">
          Cart
        </Link>
        <span className="mx-2 text-forest/25">/</span>
        <span className="text-forest">Checkout</span>
      </nav>

      <div className="mt-8 flex flex-col gap-4 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-forest/55">Checkout</p>
          <h1 className="display-title mt-4 text-[clamp(2.8rem,5.5vw,4.8rem)] text-forest">
            Delivery details.
          </h1>
        </div>
        <p className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-stone">
          <LockKeyhole className="size-3.5" strokeWidth={1.8} />
          No account required
        </p>
      </div>

      <form
        onSubmit={submit}
        noValidate
        className="mt-8 grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12"
      >
        <div className="rounded-[1.5rem] border border-line bg-white p-6 md:p-8">
          <div className="flex items-center gap-3 border-b border-line pb-5">
            <span className="flex size-8 items-center justify-center rounded-full bg-forest text-[0.62rem] font-semibold text-white">
              01
            </span>
            <div>
              <h2 className="text-sm font-semibold text-forest">Contact details</h2>
              <p className="mt-0.5 text-[0.65rem] text-stone">
                Where should we reach you about this order?
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const isWide = field.key === "customerName";
              return (
                <div key={field.key} className={isWide ? "sm:col-span-2" : ""}>
                  <label
                    htmlFor={`checkout-${field.key}`}
                    className="mb-2 block text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-charcoal/70"
                  >
                    {field.label}
                  </label>
                  <input
                    id={`checkout-${field.key}`}
                    name={field.key}
                    type={field.type}
                    inputMode={
                      field.key === "pincode" || field.key === "mobile" || field.key === "whatsapp"
                        ? "numeric"
                        : undefined
                    }
                    autoComplete={field.autoComplete}
                    value={form[field.key]}
                    onChange={(event) => update(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(errors[field.key])}
                    aria-describedby={
                      errors[field.key] ? `error-${field.key}` : undefined
                    }
                    className={`h-12 w-full rounded-xl border bg-offwhite px-4 text-sm text-charcoal outline-none transition-colors placeholder:text-stone/60 focus:border-forest focus:bg-white ${
                      errors[field.key] ? "border-red-400" : "border-line"
                    }`}
                  />
                  {errors[field.key] && (
                    <p id={`error-${field.key}`} className="mt-1.5 text-[0.65rem] text-red-700">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="sm:col-span-2">
              <label
                htmlFor="checkout-address"
                className="mb-2 block text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-charcoal/70"
              >
                Complete Delivery Address
              </label>
              <textarea
                id="checkout-address"
                name="address"
                rows={4}
                autoComplete="street-address"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                placeholder="House / flat number, street, area, landmark"
                aria-invalid={Boolean(errors.address)}
                className={`w-full resize-none rounded-xl border bg-offwhite px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-stone/60 focus:border-forest focus:bg-white ${
                  errors.address ? "border-red-400" : "border-line"
                }`}
              />
              {errors.address && (
                <p className="mt-1.5 text-[0.65rem] text-red-700">{errors.address}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="checkout-notes"
                className="mb-2 block text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-charcoal/70"
              >
                Order Notes (optional)
              </label>
              <textarea
                id="checkout-notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="Anything we should know about your delivery?"
                className="w-full resize-none rounded-xl border border-line bg-offwhite px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-stone/60 focus:border-forest focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-7 border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-forest text-[0.62rem] font-semibold text-white">
                02
              </span>
              <div>
                <h2 className="text-sm font-semibold text-forest">Review & place order</h2>
                <p className="mt-0.5 text-[0.65rem] text-stone">
                  Your order summary is shown alongside these details.
                </p>
              </div>
            </div>
          </div>

          {submitError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
            >
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group mt-6 flex h-13 w-full items-center justify-center gap-3 rounded-full bg-forest px-6 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-forest-deep disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Placing your order…" : "Place Order"}
            {!submitting && (
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            )}
          </button>
          <p className="mt-3 text-center text-[0.6rem] leading-5 text-stone">
            By placing this order, you confirm that your delivery details are
            correct. No online payment is collected on this website.
          </p>
        </div>

        <aside className="h-fit rounded-[1.5rem] border border-line bg-white p-6 md:p-7 lg:sticky lg:top-28">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <p className="eyebrow text-forest/55">Your order</p>
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-stone">
              {lines.length} {lines.length === 1 ? "line" : "lines"}
            </span>
          </div>

          <div className="divide-y divide-line">
            {lines.map(({ line, product, lineTotal }) => (
              <div key={line.variantId} className="flex gap-3 py-4">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.productName}
                  label={product.fragrance || product.productName}
                  className="size-16 shrink-0 rounded-xl"
                  contain
                  compact
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-forest">
                    {product.fragrance || product.productName}
                  </p>
                  <p className="mt-0.5 truncate text-[0.6rem] text-stone">
                    {product.productName} · Qty {line.quantity}
                  </p>
                  <p className="mt-0.5 text-[0.6rem] text-stone">
                    {product.size || "Size to be confirmed"}
                  </p>
                </div>
                <p className="shrink-0 text-xs font-semibold text-charcoal">
                  {formatPrice(lineTotal)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-charcoal/60">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-charcoal/60">Delivery</span>
              <span className="font-medium">
                {deliveryFee === 0 ? "Complimentary" : formatPrice(deliveryFee)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone">
              Final total
            </span>
            <span className="font-display text-3xl tracking-[-0.03em] text-forest">
              {formatPrice(total)}
            </span>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-mint-soft p-4">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.6} />
            <p className="text-[0.65rem] leading-5 text-forest/65">
              Your details are used only to process and confirm this order.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
