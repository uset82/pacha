"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

export async function requestMagicLink(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return { ok: false, message: "Enter a valid owner email." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured yet. Add the environment variables before owner login.",
    };
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") || getSiteUrl();
  const emailRedirectTo = `${origin}/auth/callback?next=/admin`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Check your email for the secure login link." };
}

export async function signInWithPassword(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !email.includes("@")) {
    return { ok: false, message: "Enter a valid owner email." };
  }

  if (!password) {
    return { ok: false, message: "Enter the owner password." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured yet. Add the environment variables before owner login.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { ok: false, message: error?.message || "Invalid email or password." };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id, active")
    .eq("user_id", data.user.id)
    .eq("active", true)
    .maybeSingle();

  if (adminError) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "Signed in, but the admin tables could not be read. Run the migrations and try again.",
    };
  }

  if (!admin) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "This email is not registered as an active owner.",
    };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
