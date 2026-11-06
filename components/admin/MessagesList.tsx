"use client";

import { CheckCheck, Mail, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import type { ContactMessage } from "@/lib/types";
import { cn, formatOrderDate } from "@/lib/utils";

export function MessagesList({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      filter === "unread"
        ? messages.filter((message) => !message.isRead)
        : messages,
    [filter, messages],
  );

  const unread = messages.filter((message) => !message.isRead).length;

  async function toggleRead(message: ContactMessage) {
    setUpdating(message.id);
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !message.isRead }),
      });
      if (response.ok) {
        setMessages((current) =>
          current.map((entry) =>
            entry.id === message.id
              ? { ...entry, isRead: !message.isRead }
              : entry,
          ),
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between gap-4 border-y border-line py-4">
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.56rem] font-semibold uppercase tracking-[0.09em] transition-colors",
                filter === option
                  ? "border-forest bg-forest text-white"
                  : "border-line bg-white text-charcoal/55 hover:text-forest",
              )}
            >
              {option === "all" ? "All messages" : "Unread"}
              <span
                className={cn(
                  "ml-1.5",
                  filter === option ? "text-white/50" : "text-stone",
                )}
              >
                {option === "all" ? messages.length : unread}
              </span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-forest">No messages here</p>
          <p className="mt-1 text-xs text-stone">
            Enquiries submitted through the contact page will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {visible.map((message) => (
            <article
              key={message.id}
              className={cn(
                "rounded-2xl border bg-white p-5 transition-colors",
                message.isRead ? "border-line" : "border-forest/25",
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-forest">
                      {message.name}
                    </h2>
                    {!message.isRead && (
                      <span className="rounded-full bg-mint px-2 py-0.5 text-[0.46rem] font-bold uppercase tracking-[0.1em] text-forest">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[0.58rem] uppercase tracking-[0.08em] text-stone">
                    {formatOrderDate(message.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(message)}
                  disabled={updating === message.id}
                  className="inline-flex h-8 items-center gap-1.5 self-start rounded-full border border-line px-3 text-[0.52rem] font-semibold uppercase tracking-[0.08em] text-forest transition-colors hover:bg-mint-soft disabled:opacity-50"
                >
                  <CheckCheck className="size-3" strokeWidth={1.9} />
                  Mark as {message.isRead ? "unread" : "read"}
                </button>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-xs leading-6 text-charcoal/70">
                {message.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-3">
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex items-center gap-1.5 text-[0.62rem] text-forest hover:underline"
                >
                  <Mail className="size-3.5" strokeWidth={1.7} />
                  {message.email}
                </a>
                {message.phone && (
                  <a
                    href={`tel:${message.phone}`}
                    className="inline-flex items-center gap-1.5 text-[0.62rem] text-forest hover:underline"
                  >
                    <Phone className="size-3.5" strokeWidth={1.7} />
                    {message.phone}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
