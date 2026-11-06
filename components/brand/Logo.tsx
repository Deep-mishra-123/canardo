import Link from "next/link";

export function LeafMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M9 33C7 18 17 8 38 6c1 20-9 31-26 31"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M13 38c8-11 17-18 28-22"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${
        tone === "light" ? "text-white" : "text-forest"
      } ${className}`}
    >
      <LeafMark className="size-8 transition-transform duration-500 group-hover:-rotate-6" />
      <span className="flex flex-col">
        <span className="font-display text-[1.55rem] leading-none tracking-[0.16em]">
          CANARDO
        </span>
        <span className="mt-1 text-[0.48rem] font-semibold leading-none tracking-[0.42em] opacity-70">
          FLOOR CARE
        </span>
      </span>
    </Link>
  );
}
