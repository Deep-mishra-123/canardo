"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { contactSchema } from "@/lib/validation";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setErrors({});

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not send your message.");
        return;
      }
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-[1.5rem] border border-line bg-white p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-mint text-forest">
          <Send className="size-6" strokeWidth={1.6} />
        </span>
        <h2 className="display-title mt-6 text-4xl text-forest">Message received.</h2>
        <p className="mt-3 max-w-sm text-sm leading-7 text-charcoal/55">
          Thank you for reaching out to CANARDO. Your message has been added to
          our enquiries dashboard.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-forest underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-[1.5rem] border border-line bg-white p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-charcoal/65"
          >
            Full name
          </label>
          <input
            id="contact-name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Your name"
            className={`h-11 w-full rounded-xl border bg-offwhite px-4 text-sm outline-none focus:border-forest focus:bg-white ${
              errors.name ? "border-red-400" : "border-line"
            }`}
          />
          {errors.name && <p className="mt-1.5 text-[0.62rem] text-red-700">{errors.name}</p>}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-charcoal/65"
          >
            Email address
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.com"
            className={`h-11 w-full rounded-xl border bg-offwhite px-4 text-sm outline-none focus:border-forest focus:bg-white ${
              errors.email ? "border-red-400" : "border-line"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-[0.62rem] text-red-700">{errors.email}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-phone"
            className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-charcoal/65"
          >
            Phone number (optional)
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="If you would like a call back"
            className="h-11 w-full rounded-xl border border-line bg-offwhite px-4 text-sm outline-none focus:border-forest focus:bg-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-message"
            className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-charcoal/65"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            rows={6}
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder="How can we help?"
            className={`w-full resize-none rounded-xl border bg-offwhite px-4 py-3 text-sm leading-6 outline-none focus:border-forest focus:bg-white ${
              errors.message ? "border-red-400" : "border-line"
            }`}
          />
          {errors.message && (
            <p className="mt-1.5 text-[0.62rem] text-red-700">{errors.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-full bg-forest px-7 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-forest-deep disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" strokeWidth={2} />
        ) : (
          <Send className="size-4" strokeWidth={1.8} />
        )}
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
