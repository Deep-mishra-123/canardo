"use client";

import { ImagePlus, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export function ImageUploader({
  value,
  onChange,
  onUploaded,
  label = "Product image",
}: {
  value: string;
  onChange: (url: string) => void;
  onUploaded?: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      onChange(data.url);
      onUploaded?.(data.url);
    } catch {
      setError("Network error while uploading.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="mb-2 text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-stone">
        {label}
      </p>
      <div className="flex gap-3">
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-offwhite">
          {value ? (
            <img
              src={value}
              alt=""
              className="absolute inset-0 size-full object-contain"
            />
          ) : (
            <ImagePlus className="size-6 text-stone/50" strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Image URL"
            className="h-9 w-full rounded-lg border border-line bg-white px-3 text-[0.68rem] text-charcoal outline-none placeholder:text-stone/50 focus:border-forest"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-forest/15 bg-white px-3 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-forest transition-colors hover:bg-mint-soft disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
            ) : (
              <Upload className="size-3.5" strokeWidth={1.8} />
            )}
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          <p className="text-[0.55rem] text-stone">JPG, PNG, WebP or SVG · max 8 MB</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
      />
      {error && <p className="mt-2 text-[0.62rem] text-red-700">{error}</p>}
    </div>
  );
}
