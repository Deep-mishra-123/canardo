"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import type { StorefrontItem } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  compact = false,
  className,
}: {
  product: StorefrontItem;
  priority?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();
  const unavailable = product.price === null || product.price <= 0;
  const title = product.fragrance || product.productName;

  function buyNow() {
    const added = addItem(product.variantId, quantity);
    if (added) router.push("/checkout");
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:border-forest/15 hover:shadow-card",
        className,
      )}
    >
      <Link
        href={`/product/${product.variantSlug}`}
        className="relative block overflow-hidden"
        aria-label={`View ${product.productName}${product.fragrance ? ` in ${product.fragrance}` : ""}`}
      >
        <ProductImage
          src={product.imageUrl}
          alt={`${product.productName}${product.fragrance ? ` — ${product.fragrance}` : ""}`}
          label={title}
          priority={priority}
          className={cn(
            "aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.02]",
            compact && "aspect-square",
          )}
        />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/88 px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-forest backdrop-blur">
            {product.category === "floor-cleaner" ? "Floor Care" : "Hand Care"}
          </span>
          {product.isPlaceholderImage && (
            <span className="rounded-full bg-forest/85 px-2.5 py-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
              Concept visual
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {product.fragrance && (
              <p className="mb-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-stone">
                {product.productName}
              </p>
            )}
            <h3 className="font-display text-[1.65rem] leading-none tracking-[-0.03em] text-forest">
              <Link
                href={`/product/${product.variantSlug}`}
                className="transition-opacity hover:opacity-70"
              >
                {title}
              </Link>
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-forest">
              {formatPrice(product.price)}
            </p>
            <p className="mt-1 text-[0.58rem] uppercase tracking-[0.1em] text-stone">
              {product.size || "Size pending"}
            </p>
          </div>
        </div>

        {!compact && (
          <p className="mt-4 line-clamp-2 text-[0.78rem] leading-6 text-stone">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              compact
              disabled={unavailable}
              label={`Quantity for ${title}`}
            />
            {unavailable && (
              <span className="text-[0.58rem] font-medium uppercase tracking-[0.1em] text-stone">
                Available soon
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={unavailable}
              onClick={() => addItem(product.variantId, quantity)}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-forest/20 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-forest transition-all hover:border-forest hover:bg-mint-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag className="size-3.5" strokeWidth={1.8} />
              Add to Cart
            </button>
            <button
              type="button"
              disabled={unavailable}
              onClick={buyNow}
              className="group/btn inline-flex h-11 items-center justify-center gap-1 rounded-full bg-forest px-3 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
