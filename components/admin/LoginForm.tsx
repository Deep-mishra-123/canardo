"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="admin-email"
          className="mb-2 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-charcoal/70"
        >
          Admin email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@canardo.com"
          className="h-12 w-full rounded-xl border border-line bg-offwhite px-4 text-sm text-charcoal outline-none transition-colors placeholder:text-stone/55 focus:border-forest focus:bg-white"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-charcoal/70"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="h-12 w-full rounded-xl border border-line bg-offwhite pl-4 pr-12 text-sm text-charcoal outline-none transition-colors placeholder:text-stone/55 focus:border-forest focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg text-stone transition-colors hover:text-forest"
          >
            {showPassword ? (
              <EyeOff className="size-4" strokeWidth={1.7} />
            ) : (
              <Eye className="size-4" strokeWidth={1.7} />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-forest-deep disabled:cursor-wait disabled:opacity-60"
      >
        <LockKeyhole className="size-4" strokeWidth={1.8} />
        {submitting ? "Signing in…" : "Sign in to Dashboard"}
      </button>

      <p className="text-center text-[0.6rem] leading-5 text-stone">
        This area is for authorised CANARDO administrators only.
      </p>
    </form>
  );
}
