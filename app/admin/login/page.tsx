import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Owner Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main id="main" className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#10231c_0%,#070706_58%)] px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex text-sm text-mist transition hover:text-brass">
          Back to site
        </Link>
        <div className="mb-6">
          <p className="eyebrow mb-3">Owner access</p>
          <h1 className="font-display text-5xl font-semibold text-ivory">Sign in to Pacha.</h1>
          <p className="mt-4 text-sm leading-6 text-mist">
            Magic links are restricted by the `admin_users` table after Supabase is connected.
          </p>
        </div>
        {!configured && (
          <p className="mb-4 rounded-lg border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-ivory">
            Supabase env vars are missing, so login is in setup mode.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
