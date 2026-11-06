"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  compact = false,
  label = "Quantity",
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-white",
        compact ? "h-9" : "h-12",
        disabled && "opacity-50",
      )}
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          "flex items-center justify-center text-forest transition-colors hover:text-forest-deep disabled:cursor-not-allowed disabled:opacity-30",
          compact ? "size-9" : "size-11",
        )}
      >
        <Minus className={compact ? "size-3" : "size-3.5"} strokeWidth={2} />
      </button>
      <span
        aria-live="polite"
        className={cn(
          "min-w-6 text-center font-semibold tabular-nums text-charcoal",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          "flex items-center justify-center text-forest transition-colors hover:text-forest-deep disabled:cursor-not-allowed disabled:opacity-30",
          compact ? "size-9" : "size-11",
        )}
      >
        <Plus className={compact ? "size-3" : "size-3.5"} strokeWidth={2} />
      </button>
    </div>
  );
}
