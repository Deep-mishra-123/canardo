"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { ProductCategory, StorefrontItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: Array<{ label: string; value: "all" | ProductCategory }> = [
  { label: "All Products", value: "all" },
  { label: "Floor Cleaner", value: "floor-cleaner" },
  { label: "Hand Wash", value: "hand-wash" },
];

export function ShopGrid({
  products,
  initialFilter = "all",
}: {
  products: StorefrontItem[];
  initialFilter?: "all" | ProductCategory;
}) {
  const [filter, setFilter] = useState<"all" | ProductCategory>(initialFilter);

  const visible = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((product) => product.category === filter),
    [filter, products],
  );

  return (
    <>
      <h2 className="sr-only">Shop products</h2>
      <div className="flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter products">
          {filters.map((option) => {
            const count =
              option.value === "all"
                ? products.length
                : products.filter((product) => product.category === option.value).length;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.62rem] font-semibold uppercase tracking-[0.11em] transition-all",
                  filter === option.value
                    ? "border-forest bg-forest text-white"
                    : "border-line bg-white text-charcoal/75 hover:border-forest/30 hover:text-forest",
                )}
              >
                {option.label}
                <span
                  className={cn(
                    "text-[0.55rem]",
                    filter === option.value ? "text-white/55" : "text-stone",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-stone">
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {visible.map((product, index) => (
          <Reveal key={product.variantId} delay={(index % 3) * 60}>
            <ProductCard product={product} priority={index < 3} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
