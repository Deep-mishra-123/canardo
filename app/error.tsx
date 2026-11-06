"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-5 text-center">
      <p className="eyebrow justify-center text-forest/50">Something went wrong</p>
      <h1 className="display-title mt-4 text-5xl text-forest">
        We hit an unexpected snag.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-charcoal/55">
        Please try again. If the issue continues, return to the homepage and
        retry from there.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 inline-flex h-11 items-center rounded-full bg-forest px-6 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white"
      >
        Try again
      </button>
    </div>
  );
}
