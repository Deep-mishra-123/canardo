import type { Product, StorefrontItem } from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Price pending";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function flattenProducts(products: Product[]): StorefrontItem[] {
  return products
    .filter((product) => product.isActive)
    .flatMap((product) =>
      product.variants
        .filter((variant) => variant.isActive)
        .map((variant) => ({
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          category: product.category,
          productDescription: product.description,
          variantId: variant.id,
          variantName: variant.name,
          variantSlug: variant.slug,
          fragrance: variant.fragrance,
          size: variant.size,
          price: variant.price,
          imageUrl: variant.imageUrl,
          description: variant.description,
          isPlaceholderImage: product.isPlaceholderImage,
          isActive: variant.isActive,
          sortOrder: product.sortOrder * 100 + variant.sortOrder,
        })),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function deliveryFee() {
  const value = Number(process.env.DELIVERY_FEE ?? "0");
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function sanitizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function displayPhone(value: string) {
  return value;
}
