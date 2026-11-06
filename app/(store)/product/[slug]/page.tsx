import Link from "next/link";
import { Leaf, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { getStorefrontItemBySlug, getStorefrontItems } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getStorefrontItemBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  const title = product.fragrance
    ? `${product.productName} — ${product.fragrance}`
    : product.productName;
  return {
    title,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getStorefrontItemBySlug(slug);
  if (!product) notFound();

  const all = await getStorefrontItems();
  const related = all
    .filter(
      (item) =>
        item.variantId !== product.variantId &&
        item.category === product.category,
    )
    .slice(0, 3);

  const title = product.fragrance || product.productName;

  return (
    <div className="bg-offwhite pb-20 pt-8 md:pb-28 md:pt-10">
      <div className="container-page">
        <nav
          aria-label="Breadcrumb"
          className="text-[0.62rem] uppercase tracking-[0.15em] text-stone"
        >
          <Link href="/" className="transition-colors hover:text-forest">
            Home
          </Link>
          <span className="mx-2 text-forest/25">/</span>
          <Link href="/shop" className="transition-colors hover:text-forest">
            Shop
          </Link>
          <span className="mx-2 text-forest/25">/</span>
          <Link
            href={
              product.category === "floor-cleaner"
                ? "/floor-cleaner"
                : "/hand-liquid-wash"
            }
            className="transition-colors hover:text-forest"
          >
            {product.category === "floor-cleaner" ? "Floor Cleaner" : "Hand Wash"}
          </Link>
          <span className="mx-2 text-forest/25">/</span>
          <span className="text-forest">{title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          <div>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white">
              <ProductImage
                src={product.imageUrl}
                alt={`${product.productName}${product.fragrance ? ` — ${product.fragrance}` : ""}`}
                label={title}
                priority
                className="aspect-[4/5] w-full"
              />
              <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-2">
                <span className="rounded-full bg-white/90 px-3.5 py-2 text-[0.57rem] font-semibold uppercase tracking-[0.15em] text-forest backdrop-blur">
                  {product.category === "floor-cleaner" ? "Floor Care" : "Hand Care"}
                </span>
                {product.isPlaceholderImage && (
                  <span className="rounded-full bg-forest/88 px-3 py-2 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                    Concept visual
                  </span>
                )}
              </div>
            </div>
            {product.isPlaceholderImage && (
              <p className="mt-3 text-[0.6rem] leading-5 text-stone">
                Concept visual shown. The official product photograph will
                replace this image.
              </p>
            )}
          </div>

          <div className="lg:py-5">
            <p className="eyebrow text-forest/55">
              {product.category === "floor-cleaner"
                ? "CANARDO Floor Care"
                : "CANARDO Hand Care"}
            </p>
            <h1 className="display-title mt-5 text-[clamp(3rem,6vw,5.7rem)] text-forest">
              {title}
            </h1>
            {product.fragrance && (
              <p className="mt-2 font-display text-xl italic text-forest/50">
                {product.productName}
              </p>
            )}

            <p className="mt-7 max-w-xl text-sm leading-7 text-charcoal/62">
              {product.description}
            </p>

            <div className="mt-8 border-y border-line py-7">
              <ProductPurchase product={product} />
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-forest">
                  <Leaf className="size-4" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-forest">
                    Fragrance
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    {product.fragrance || "Fragrance-free expression"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-forest">
                  <PackageCheck className="size-4" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-forest">
                    Bottle size
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    {product.size || "To be confirmed"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-forest">
                  <ShieldCheck className="size-4" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-forest">
                    Ordering
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    No account or registration required
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-forest">
                  <Sparkles className="size-4" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-forest">
                    Price
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 divide-y divide-line border-t border-line">
              <details className="group py-4" open>
                <summary className="flex cursor-pointer list-none items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-forest">
                  Product details
                  <span className="text-lg font-light text-forest/40 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pt-3 text-xs leading-6 text-stone">
                  <p>{product.productDescription}</p>
                  <p className="mt-2">
                    Fragrance expression: {product.fragrance || "—"} · Bottle
                    size: {product.size || "to be confirmed"}.
                  </p>
                </div>
              </details>
              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-forest">
                  Ordering & confirmation
                  <span className="text-lg font-light text-forest/40 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pt-3 text-xs leading-6 text-stone">
                  Add your selection to the cart, share your delivery details at
                  checkout and place your order. You will receive a unique order
                  number and an order summary on screen. Your order will be
                  reviewed using the contact details you provide.
                </p>
              </details>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-line pt-12 md:mt-28">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="eyebrow text-forest/55">Continue exploring</p>
                <h2 className="display-title mt-4 text-[clamp(2.2rem,4vw,3.6rem)] text-forest">
                  {product.category === "floor-cleaner"
                    ? "More fragrance expressions"
                    : "More from CANARDO"}
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-forest sm:block"
              >
                Shop all
              </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.variantId}
                  href={`/product/${item.variantSlug}`}
                  className="group rounded-[1.4rem] border border-line bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <ProductImage
                    src={item.imageUrl}
                    alt={`${item.productName}${item.fragrance ? ` — ${item.fragrance}` : ""}`}
                    label={item.fragrance || item.productName}
                    className="aspect-[4/3] w-full rounded-xl"
                  />
                  <div className="flex items-end justify-between px-1 pb-1 pt-4">
                    <div>
                      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-stone">
                        {item.productName}
                      </p>
                      <h3 className="mt-1 font-display text-2xl text-forest">
                        {item.fragrance || item.productName}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-forest">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
