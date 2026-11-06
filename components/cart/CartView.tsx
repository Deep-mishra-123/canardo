"use client";

import Link from "next/link";
import { ArrowRight, Leaf, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const {
    lines,
    hydrated,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    setQuantity,
    removeItem,
  } = useCart();

  const unavailable = lines.some(
    (entry) => entry.product.price === null || !entry.product.isActive,
  );

  if (!hydrated) {
    return (
      <div className="container-page py-20">
        <div className="h-8 w-52 animate-pulse rounded-full bg-mint" />
        <div className="mt-10 h-48 animate-pulse rounded-3xl bg-white" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full border border-forest/10 bg-mint-soft text-forest">
          <ShoppingBag className="size-8" strokeWidth={1.3} />
        </span>
        <p className="eyebrow mt-8 justify-center text-forest/50">Your cart</p>
        <h1 className="display-title mt-4 text-[clamp(2.6rem,5vw,4.4rem)] text-forest">
          Your cart is empty.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-7 text-charcoal/55">
          Explore the CANARDO collection and find the fragrance that feels right
          for your home.
        </p>
        <Link
          href="/shop"
          className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-forest px-7 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-forest-deep"
        >
          Shop the collection
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            strokeWidth={1.8}
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12 md:py-16">
      <div className="flex flex-col gap-4 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-forest/55">Shopping cart</p>
          <h1 className="display-title mt-4 text-[clamp(2.8rem,5.5vw,4.8rem)] text-forest">
            Your selection.
          </h1>
        </div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-stone">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
        <div className="space-y-4">
          {lines.map(({ line, product, lineTotal }) => {
            const itemUnavailable =
              product.price === null || product.price <= 0 || !product.isActive;
            return (
              <article
                key={line.variantId}
                className="grid gap-4 rounded-[1.4rem] border border-line bg-white p-4 sm:grid-cols-[8rem_1fr] sm:p-5"
              >
                <Link
                  href={`/product/${product.variantSlug}`}
                  className="block overflow-hidden rounded-xl"
                >
                  <ProductImage
                    src={product.imageUrl}
                    alt={`${product.productName}${product.fragrance ? ` — ${product.fragrance}` : ""}`}
                    label={product.fragrance || product.productName}
                    className="aspect-square w-full"
                  />
                </Link>

                <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-stone">
                        {product.category === "floor-cleaner"
                          ? "Floor Care"
                          : "Hand Care"}
                      </p>
                      <h2 className="mt-1.5 font-display text-2xl tracking-[-0.02em] text-forest">
                        <Link
                          href={`/product/${product.variantSlug}`}
                          className="transition-opacity hover:opacity-70"
                        >
                          {product.fragrance || product.productName}
                        </Link>
                      </h2>
                      {product.fragrance && (
                        <p className="mt-0.5 text-xs text-stone">
                          {product.productName}
                        </p>
                      )}
                      <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.1em] text-stone">
                        {product.size || "Size to be confirmed"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.variantId)}
                      aria-label={`Remove ${product.productName} from cart`}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-4" strokeWidth={1.6} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(value) => setQuantity(line.variantId, value)}
                      compact
                      disabled={itemUnavailable}
                      label={`Quantity for ${product.productName}`}
                    />
                    <div className="text-right">
                      <p className="text-sm font-semibold text-forest">
                        {formatPrice(lineTotal)}
                      </p>
                      <p className="mt-0.5 text-[0.58rem] text-stone">
                        {formatPrice(product.price)} each
                      </p>
                    </div>
                  </div>

                  {itemUnavailable && (
                    <p className="mt-3 text-[0.65rem] text-red-700">
                      This item is currently unavailable. Remove it to continue.
                    </p>
                  )}
                </div>
              </article>
            );
          })}

          <div className="pt-2">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-forest"
            >
              <ArrowRight
                className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-1"
                strokeWidth={1.8}
              />
              Continue shopping
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-[1.5rem] border border-line bg-white p-6 md:p-7 lg:sticky lg:top-28">
          <p className="eyebrow text-forest/55">Order summary</p>
          <div className="mt-6 space-y-3.5 border-b border-line pb-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-charcoal/60">Subtotal</span>
              <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-charcoal/60">Delivery</span>
              <span className="font-medium text-charcoal">
                {deliveryFee === 0 ? "Complimentary" : formatPrice(deliveryFee)}
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 py-5">
            <div>
              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-stone">
                Total
              </span>
              <p className="mt-1 font-display text-3xl tracking-[-0.03em] text-forest">
                {formatPrice(total)}
              </p>
            </div>
            <span className="text-[0.58rem] text-stone">Inclusive of all charges</span>
          </div>

          {unavailable ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
              Please remove unavailable items before checkout.
            </div>
          ) : (
            <Link
              href="/checkout"
              className="group flex h-13 w-full items-center justify-center gap-3 rounded-full bg-forest px-6 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-forest-deep"
            >
              Proceed to Checkout
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
          )}

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-mint-soft p-4">
            <Leaf className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.6} />
            <p className="text-[0.65rem] leading-5 text-forest/65">
              No account needed. Your order is confirmed with the contact details
              you share at checkout.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
