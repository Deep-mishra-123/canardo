"use client";

import { Check } from "lucide-react";
import { useEffect } from "react";

export function Toast({
  message,
  show,
  onClose,
}: {
  message: string;
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const timeout = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timeout);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-toast-in">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-forest px-5 py-3.5 text-sm font-medium text-white shadow-float">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint text-forest">
          <Check className="size-3.5" strokeWidth={2.5} />
        </span>
        {message}
      </div>
    </div>
  );
}
