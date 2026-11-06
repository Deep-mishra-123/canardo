import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | CANARDO Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const mode = isSupabaseConfigured() ? "supabase" : "local";

  return (
    <div className="min-h-screen bg-[#f2f6f2]">
      <AdminNav email={session.email} mode={mode} />
      <div className="lg:pl-[17rem]">
        <main className="mx-auto w-full max-w-[100rem] px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
