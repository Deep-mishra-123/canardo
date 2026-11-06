"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Product } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { productUpdateSchema } from "@/lib/validation";

type VariantForm = {
  key: string;
  id?: string;
  name: string;
  slug: string;
  fragrance: string;
  size: string;
  price: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
};

type FormState = {
  name: string;
  slug: string;
  category: "floor-cleaner" | "hand-wash";
  description: string;
  imageUrl: string;
  isActive: boolean;
  isPlaceholderImage: boolean;
  sortOrder: number;
  variants: VariantForm[];
};

function blankVariant(sortOrder: number): VariantForm {
  return {
    key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    slug: "",
    fragrance: "",
    size: "",
    price: "",
    imageUrl: "",
    description: "",
    isActive: true,
    sortOrder,
  };
}

function fromProduct(product: Product | null): FormState {
  if (!product) {
    return {
      name: "",
      slug: "",
      category: "floor-cleaner",
      description: "",
      imageUrl: "",
      isActive: true,
      isPlaceholderImage: false,
      sortOrder: 1,
      variants: [blankVariant(1)],
    };
  }

  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl,
    isActive: product.isActive,
    isPlaceholderImage: product.isPlaceholderImage,
    sortOrder: product.sortOrder,
    variants: product.variants.map((variant) => ({
      key: variant.id,
      id: variant.id,
      name: variant.name,
      slug: variant.slug,
      fragrance: variant.fragrance || "",
      size: variant.size || "",
      price: variant.price === null ? "" : String(variant.price),
      imageUrl: variant.imageUrl,
      description: variant.description,
      isActive: variant.isActive,
      sortOrder: variant.sortOrder,
    })),
  };
}

export function ProductEditor({ product }: { product: Product | null }) {
  const router = useRouter();
  const createMode = !product;
  const [form, setForm] = useState<FormState>(() => fromProduct(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSuccess("");
  }

  function updateVariant(key: string, patch: Partial<VariantForm>) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant) =>
        variant.key === key ? { ...variant, ...patch } : variant,
      ),
    }));
    setError("");
    setSuccess("");
  }

  function removeVariant(key: string) {
    if (form.variants.length <= 1) {
      setError("A product must have at least one variant.");
      return;
    }
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((variant) => variant.key !== key),
    }));
  }

  async function save() {
    setError("");
    setSuccess("");

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category: form.category,
      description: form.description.trim(),
      imageUrl:
        form.imageUrl.trim() ||
        form.variants.find((variant) => variant.imageUrl.trim())?.imageUrl.trim() ||
        "",
      isActive: form.isActive,
      isPlaceholderImage: form.isPlaceholderImage,
      sortOrder: Number(form.sortOrder) || 0,
      variants: form.variants.map((variant) => ({
        id: variant.id,
        name: variant.name.trim(),
        slug: variant.slug.trim(),
        fragrance: variant.fragrance.trim() || null,
        size: variant.size.trim() || null,
        price: variant.price.trim() === "" ? null : Number(variant.price),
        imageUrl: variant.imageUrl.trim(),
        description: variant.description.trim(),
        isActive: variant.isActive,
        sortOrder: Number(variant.sortOrder) || 0,
      })),
    };

    const parsed = productUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError(
        `${issue?.path.join(".") ? `${issue.path.join(".")}: ` : ""}${issue?.message || "Please check the product details."}`,
      );
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        createMode ? "/api/admin/products" : `/api/admin/products/${product!.id}`,
        {
          method: createMode ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not save product.");
        return;
      }

      setSuccess(createMode ? "Product created." : "Product saved.");
      if (createMode) {
        router.replace(`/admin/products/${data.product.id}`);
        router.refresh();
        return;
      }

      setForm(fromProduct(data.product as Product));
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl pb-8">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.11em] text-stone transition-colors hover:text-forest"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.8} />
            Back to products
          </Link>
          <h1 className="display-title mt-3 text-4xl text-forest md:text-5xl">
            {createMode ? "New product." : "Edit product."}
          </h1>
          <p className="mt-2 text-xs text-charcoal/50">
            Update pricing, bottle size, descriptions, fragrance variants and
            images.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!createMode && product && (
            <Link
              href={`/product/${product.variants[0]?.slug || product.slug}`}
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[0.58rem] font-semibold uppercase tracking-[0.09em] text-forest hover:bg-mint-soft"
            >
              View
              <ExternalLink className="size-3.5" strokeWidth={1.7} />
            </Link>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-forest px-5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-forest-deep disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
            ) : (
              <Save className="size-3.5" strokeWidth={1.8} />
            )}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
          {error}
        </div>
      )}
      {success && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          {success}
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-line bg-white p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-forest">Product details</h2>
            <p className="mt-0.5 text-[0.6rem] text-stone">
              These details appear across the storefront.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-stone">
              {form.isActive ? "Live" : "Hidden"}
            </span>
            <span
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                form.isActive ? "bg-forest" : "bg-line",
              )}
            >
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => update("isActive", event.target.checked)}
                className="sr-only"
              />
              <span
                className={cn(
                  "absolute top-1 size-4 rounded-full bg-white shadow transition-all",
                  form.isActive ? "left-6" : "left-1",
                )}
              />
            </span>
          </label>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-stone">
              Product name
            </label>
            <input
              value={form.name}
              onChange={(event) => {
                const value = event.target.value;
                update("name", value);
                if (createMode) {
                  setForm((current) => ({
                    ...current,
                    name: value,
                    slug: current.slug || slugify(value),
                  }));
                }
              }}
              placeholder="Floor Cleaning Liquid"
              className="h-10 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-stone">
              URL slug
            </label>
            <input
              value={form.slug}
              onChange={(event) => update("slug", slugify(event.target.value))}
              placeholder="floor-cleaner"
              className="h-10 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-stone">
              Category
            </label>
            <select
              value={form.category}
              onChange={(event) =>
                update("category", event.target.value as FormState["category"])
              }
              className="h-10 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
            >
              <option value="floor-cleaner">Floor Cleaner</option>
              <option value="hand-wash">Hand Wash</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-stone">
              Sort order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => update("sortOrder", Number(event.target.value))}
              className="h-10 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-stone">
              Product description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className="w-full resize-none rounded-lg border border-line bg-offwhite px-3 py-2.5 text-xs leading-5 outline-none focus:border-forest focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              value={form.imageUrl}
              onChange={(url) => update("imageUrl", url)}
              label="Primary product image"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isPlaceholderImage}
              onChange={(event) =>
                update("isPlaceholderImage", event.target.checked)
              }
              className="mt-0.5 size-4 accent-[#123D2B]"
            />
            <span>
              <span className="block text-xs font-medium text-charcoal">
                Mark as a concept / placeholder image
              </span>
              <span className="mt-0.5 block text-[0.6rem] leading-5 text-stone">
                Enable this while the product uses a temporary visual. The
                storefront will label it clearly. Turn it off after uploading the
                official photograph.
              </span>
            </span>
          </label>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-forest">
              Variants & fragrances
            </h2>
            <p className="mt-0.5 text-[0.6rem] text-stone">
              Each variant is a separate product card with its own price, size
              and image.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((current) => ({
                ...current,
                variants: [
                  ...current.variants,
                  blankVariant(current.variants.length + 1),
                ],
              }))
            }
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-forest/15 bg-white px-4 text-[0.56rem] font-semibold uppercase tracking-[0.09em] text-forest hover:bg-mint-soft"
          >
            <Plus className="size-3.5" strokeWidth={1.9} />
            Add variant
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {form.variants.map((variant, index) => (
            <div
              key={variant.key}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-mint-soft text-[0.55rem] font-semibold text-forest">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs font-semibold text-forest">
                    {variant.fragrance || variant.name || "New variant"}
                  </p>
                  {!variant.isActive && (
                    <span className="rounded-full bg-line px-2 py-1 text-[0.48rem] font-semibold uppercase tracking-[0.08em] text-stone">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-stone">
                    <input
                      type="checkbox"
                      checked={variant.isActive}
                      onChange={(event) =>
                        updateVariant(variant.key, {
                          isActive: event.target.checked,
                        })
                      }
                      className="size-3.5 accent-[#123D2B]"
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.key)}
                    aria-label="Remove variant"
                    className="flex size-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.7} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-[12rem_1fr]">
                <div>
                  <ImageUploader
                    value={variant.imageUrl}
                    onChange={(url) => updateVariant(variant.key, { imageUrl: url })}
                    onUploaded={() => {
                      if (form.isPlaceholderImage) {
                        update("isPlaceholderImage", false);
                      }
                    }}
                    label="Variant image"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.09em] text-stone">
                      Display name
                    </label>
                    <input
                      value={variant.name}
                      onChange={(event) => {
                        const value = event.target.value;
                        updateVariant(variant.key, {
                          name: value,
                          slug:
                            variant.slug ||
                            (createMode || !variant.id
                              ? `${slugify(form.name)}-${slugify(value)}`
                              : variant.slug),
                        });
                      }}
                      placeholder="Vetiver"
                      className="h-9 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.09em] text-stone">
                      Fragrance
                    </label>
                    <input
                      value={variant.fragrance}
                      onChange={(event) =>
                        updateVariant(variant.key, {
                          fragrance: event.target.value,
                        })
                      }
                      placeholder="Vetiver"
                      className="h-9 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.09em] text-stone">
                      URL slug
                    </label>
                    <input
                      value={variant.slug}
                      onChange={(event) =>
                        updateVariant(variant.key, {
                          slug: slugify(event.target.value),
                        })
                      }
                      placeholder="floor-cleaner-vetiver"
                      className="h-9 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.09em] text-stone">
                        Price (INR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(variant.key, { price: event.target.value })
                        }
                        placeholder="Not set"
                        className="h-9 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.09em] text-stone">
                        Bottle size
                      </label>
                      <input
                        value={variant.size}
                        onChange={(event) =>
                          updateVariant(variant.key, { size: event.target.value })
                        }
                        placeholder="e.g. 1 L"
                        className="h-9 w-full rounded-lg border border-line bg-offwhite px-3 text-xs outline-none focus:border-forest focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.09em] text-stone">
                      Variant description
                    </label>
                    <textarea
                      rows={2}
                      value={variant.description}
                      onChange={(event) =>
                        updateVariant(variant.key, {
                          description: event.target.value,
                        })
                      }
                      className="w-full resize-none rounded-lg border border-line bg-offwhite px-3 py-2 text-xs leading-5 outline-none focus:border-forest focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 z-20 mt-7 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/95 p-3 shadow-card backdrop-blur">
        <p className="hidden text-[0.6rem] text-stone sm:block">
          Changes are visible on the storefront immediately.
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-forest px-5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-forest-deep disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
          ) : (
            <Save className="size-3.5" strokeWidth={1.8} />
          )}
          {saving ? "Saving…" : createMode ? "Create product" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
