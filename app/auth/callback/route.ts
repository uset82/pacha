import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") || "/admin";
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(new URL(`/admin/login?reason=not_configured`, requestUrl.origin));
  }

  if (code) {
    const { error } = (await supabase?.auth.exchangeCodeForSession(code)) || {};

    if (error) {
      return NextResponse.redirect(new URL(`/admin/login?reason=auth_error`, requestUrl.origin));
    }
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      return NextResponse.redirect(new URL(`/admin/login?reason=auth_error`, requestUrl.origin));
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  const clientFallbackUrl = new URL("/auth/client-callback", requestUrl.origin);
  clientFallbackUrl.searchParams.set("next", next);
  return NextResponse.redirect(clientFallbackUrl);
}
