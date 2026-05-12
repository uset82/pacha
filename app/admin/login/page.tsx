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

const reasonMessages: Record<string, string> = {
  auth_error: "The magic link could not be verified. Request a fresh link and open it once.",
  missing_code: "That login link did not include a Supabase auth code. Request a fresh magic link.",
  missing_token: "That login link did not include a usable Supabase session token. Check the Magic Link email template in Supabase.",
  not_admin: "You signed in, but this email is not listed as an active owner in the admin_users table.",
  not_configured: "Supabase environment variables are missing, so owner login cannot complete yet.",
  setup_error: "Supabase login worked, but the admin tables are missing or not exposed. Run the migrations, then try again.",
  signed_out: "Open the magic link in this same browser. If it opened in another browser, the login cookie was saved there instead.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ reason?: string }>;
}) {
  const configured = isSupabaseConfigured();
  const params = await searchParams;
  const reason = params?.reason;
  const reasonMessage = reason ? reasonMessages[reason] : null;

  return (
    <main id="main" className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#10231c_0%,#070706_58%)] px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex text-sm text-mist transition hover:text-brass">
          Back to site
        </Link>
        <div className="mb-6">
          <p className="eyebrow mb-3">Owner access</p>
          <h1 className="font-display text-5xl font-semibold text-ivory">Sign in to Pasha.</h1>
          <p className="mt-4 text-sm leading-6 text-mist">
            Owner access is restricted to emails in the `admin_users` table. Sign in with your
            password, or request a one-time magic link.
          </p>
        </div>
        {!configured && (
          <p className="mb-4 rounded-lg border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-ivory">
            Supabase env vars are missing, so login is in setup mode.
          </p>
        )}
        {reasonMessage && (
          <p className="mb-4 rounded-lg border border-terracotta/50 bg-terracotta/10 px-4 py-3 text-sm leading-6 text-ivory">
            {reasonMessage}
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
