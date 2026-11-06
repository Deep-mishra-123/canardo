import { MessagesList } from "@/components/admin/MessagesList";
import { listContactMessages } from "@/lib/store";

export const metadata = {
  title: "Messages",
};

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();
  const unread = messages.filter((message) => !message.isRead).length;

  return (
    <div>
      <div>
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-forest/50">
          Messages
        </p>
        <h1 className="display-title mt-2 text-4xl text-forest md:text-5xl">
          Customer enquiries.
        </h1>
        <p className="mt-2 text-xs text-charcoal/50">
          {messages.length} total · {unread} unread
        </p>
      </div>
      <MessagesList initialMessages={messages} />
    </div>
  );
}
