import { redirect } from "next/navigation";
import { LeafMark } from "@/components/brand/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";

export const metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="grid min-h-screen bg-offwhite lg:grid-cols-[0.9fr_1.1fr]">
      <section className="grain relative hidden overflow-hidden bg-forest p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="relative z-10 flex items-center gap-3">
          <LeafMark className="size-10 text-mint" />
          <div>
            <p className="font-display text-2xl tracking-[0.16em]">CANARDO</p>
            <p className="mt-1 text-[0.48rem] font-semibold tracking-[0.4em] text-white/50">
              FLOOR CARE
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="eyebrow text-mint/65">Store administration</p>
          <h1 className="display-title mt-6 text-6xl leading-[0.95] xl:text-7xl">
            The quiet side
            <span className="block italic text-mint/80">of the business.</span>
          </h1>
          <p className="mt-7 text-sm leading-7 text-white/55">
            Manage orders, update product details and keep the CANARDO
            collection current — all from one considered workspace.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-white/35">
          <span className="size-1.5 rounded-full bg-mint" />
          Secure administration
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-40 top-1/3 size-[34rem] rounded-full border border-white/[0.06]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 top-1/3 size-[22rem] rounded-full border border-white/[0.05]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -left-20 size-[30rem] rounded-full border border-white/[0.05]"
        />
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <LeafMark className="size-9 text-forest" />
            <div>
              <p className="font-display text-2xl tracking-[0.15em] text-forest">
                CANARDO
              </p>
              <p className="mt-0.5 text-[0.46rem] font-semibold tracking-[0.35em] text-forest/50">
                FLOOR CARE
              </p>
            </div>
          </div>

          <p className="eyebrow text-forest/50">Admin access</p>
          <h2 className="display-title mt-4 text-5xl text-forest">Welcome back.</h2>
          <p className="mt-4 text-sm leading-7 text-charcoal/55">
            Sign in with your authorised administrator account to manage the
            CANARDO store.
          </p>

          <LoginForm />
        </div>
      </section>
    </div>
  );
}
