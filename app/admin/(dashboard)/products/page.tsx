import Link from "next/link";
import { ArrowUpRight, ImageIcon, Plus, TriangleAlert } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { listProducts } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const products = await listProducts(true);
  const variants = products.flatMap((product) => product.variants);
  const pendingPrices = variants.filter(
    (variant) => variant.price === null || variant.price <= 0,
  ).length;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-forest/50">
            Catalogue
          </p>
          <h1 className="display-title mt-2 text-4xl text-forest md:text-5xl">
            Products.
          </h1>
          <p className="mt-2 text-xs text-charcoal/50">
            {products.length} products · {variants.length} fragrance and product
            variants
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center gap-2 self-start rounded-full bg-forest px-5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-forest-deep sm:self-auto"
        >
          <Plus className="size-3.5" strokeWidth={2} />
          Add product
        </Link>
      </div>

      {pendingPrices > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0 text-amber-700"
            strokeWidth={1.8}
          />
          <div>
            <p className="text-xs font-semibold text-amber-900">
              {pendingPrices} {pendingPrices === 1 ? "variant is" : "variants are"} not
              ready to order
            </p>
            <p className="mt-1 text-[0.65rem] leading-5 text-amber-800/75">
              Add a price and bottle size to each variant before sharing the
              storefront. Products without a price show as available soon.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {products.map((product) => (
          <section
            key={product.id}
            className="overflow-hidden rounded-2xl border border-line bg-white"
          >
            <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  label={product.name}
                  className="size-16 shrink-0 rounded-xl"
                  compact
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl tracking-[-0.02em] text-forest">
                      {product.name}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.48rem] font-semibold uppercase tracking-[0.08em] ${
                        product.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-line text-stone"
                      }`}
                    >
                      {product.isActive ? "Live" : "Hidden"}
                    </span>
                    {product.isPlaceholderImage && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[0.48rem] font-semibold uppercase tracking-[0.08em] text-amber-800">
                        <ImageIcon className="size-2.5" strokeWidth={2} />
                        Concept image
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[0.62rem] text-stone">
                    {product.variants.length} variants ·{" "}
                    {product.variants.filter((variant) => variant.isActive).length}{" "}
                    active
                  </p>
                </div>
              </div>
              <Link
                href={`/admin/products/${product.id}`}
                className="inline-flex h-9 items-center gap-2 self-start rounded-full border border-forest/15 px-4 text-[0.56rem] font-semibold uppercase tracking-[0.09em] text-forest transition-colors hover:bg-mint-soft sm:self-auto"
              >
                Edit product
                <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left">
                <thead>
                  <tr className="bg-offwhite/60 text-[0.5rem] font-semibold uppercase tracking-[0.11em] text-stone">
                    <th className="px-5 py-2.5">Variant</th>
                    <th className="px-5 py-2.5">Size</th>
                    <th className="px-5 py-2.5">Price</th>
                    <th className="px-5 py-2.5">Status</th>
                    <th className="px-5 py-2.5">Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="text-xs">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-charcoal">
                          {variant.fragrance || variant.name}
                        </p>
                        <p className="mt-0.5 text-[0.55rem] text-stone">
                          {variant.name}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-[0.64rem] text-stone">
                        {variant.size || (
                          <span className="text-amber-700">Not set</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[0.64rem]">
                        {variant.price !== null && variant.price > 0 ? (
                          <span className="font-medium text-charcoal">
                            {formatPrice(variant.price)}
                          </span>
                        ) : (
                          <span className="text-amber-700">Not set</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.48rem] font-semibold uppercase tracking-[0.08em] ${
                            variant.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-line text-stone"
                          }`}
                        >
                          {variant.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[0.58rem] ${
                            variant.imageUrl ? "text-stone" : "text-amber-700"
                          }`}
                        >
                          {variant.imageUrl ? "Uploaded" : "Missing"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
