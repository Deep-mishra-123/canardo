"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import type { StorefrontItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductPurchase({ product }: { product: StorefrontItem }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();
  const unavailable = product.price === null || product.price <= 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-stone">
            Price
          </p>
          <p className="mt-1 font-display text-3xl tracking-[-0.03em] text-forest">
            {formatPrice(product.price)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-stone">
            Bottle size
          </p>
          <p className="mt-1 text-sm font-medium text-charcoal">
            {product.size || "To be confirmed"}
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          disabled={unavailable}
          label={`Quantity for ${product.productName}`}
        />
        <button
          type="button"
          disabled={unavailable}
          onClick={() => addItem(product.variantId, quantity)}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-forest/20 px-5 text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-forest transition-all hover:border-forest hover:bg-mint-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingBag className="size-4" strokeWidth={1.8} />
          Add to Cart
        </button>
        <button
          type="button"
          disabled={unavailable}
          onClick={() => {
            const added = addItem(product.variantId, quantity);
            if (added) router.push("/checkout");
          }}
          className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-forest px-5 text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-white transition-all hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            strokeWidth={1.8}
          />
        </button>
      </div>

      {unavailable && (
        <p className="mt-4 rounded-xl bg-mint-soft px-4 py-3 text-[0.7rem] leading-5 text-forest/70">
          This product is being prepared for online ordering. Please check back
          soon for availability.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.58rem] font-medium uppercase tracking-[0.11em] text-stone">
        <span>No account needed</span>
        <span className="text-forest/20">•</span>
        <span>Secure order validation</span>
        <span className="text-forest/20">•</span>
        <span>Order confirmation included</span>
      </div>
    </div>
  );
}
