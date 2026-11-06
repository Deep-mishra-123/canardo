"use client";

import { LeafMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function ProductImage({
  src,
  alt,
  label,
  className,
  imageClassName,
  priority = false,
  contain = true,
  compact = false,
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  contain?: boolean;
  /** Shows a simplified fallback for small thumbnails. */
  compact?: boolean;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);

    const image = imageRef.current;
    if (!image) return;

    // A missing image can finish loading before hydration attaches onError.
    // Check the element after mount so the branded fallback is always shown.
    if (image.complete) {
      if (image.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [src]);

  return (
    <div className={cn("product-image-shell relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-500",
          compact ? "px-2" : "px-5",
          loaded && !failed ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        aria-hidden={loaded && !failed}
      >
        {compact ? (
          <span className="flex size-8 items-center justify-center rounded-full border border-forest/12 bg-white/55 text-forest">
            <LeafMark className="size-4" />
          </span>
        ) : (
          <>
            <span className="flex size-12 items-center justify-center rounded-full border border-forest/12 bg-white/55 text-forest">
              <LeafMark className="size-6" />
            </span>
            <span className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-forest/45">
              Official photograph
            </span>
            {label && (
              <span className="mt-2 font-display text-2xl text-forest/70">
                {label}
              </span>
            )}
            <span className="mt-1.5 text-[0.6rem] text-forest/40">
              Being prepared
            </span>
          </>
        )}
      </div>

      {!failed && src && (
        // Product photos are uploaded at runtime by the store owner.
        // Native img keeps any storage host and format compatible.
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-500",
            contain ? "object-contain" : "object-cover",
            loaded && !failed ? "opacity-100" : "opacity-0",
            imageClassName,
          )}
        />
      )}
    </div>
  );
}
