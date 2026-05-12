"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AuthClientCallbackPage() {
  useEffect(() => {
    async function finishLogin() {
      const currentUrl = new URL(window.location.href);
      const next = currentUrl.searchParams.get("next") || "/admin";
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (!accessToken || !refreshToken) {
        window.location.replace("/admin/login?reason=missing_token");
        return;
      }

      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        window.location.replace("/admin/login?reason=not_configured");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        window.location.replace("/admin/login?reason=auth_error");
        return;
      }

      window.location.replace(next);
    }

    void finishLogin();
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 text-center text-ivory">
      <div>
        <p className="eyebrow mb-3">Owner access</p>
        <h1 className="font-display text-5xl font-semibold">Finishing sign in...</h1>
        <p className="mt-4 text-sm text-mist">One moment while the secure login link is verified.</p>
      </div>
    </main>
  );
}
