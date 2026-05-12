import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminAuthState() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "not_configured" as const };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "signed_out" as const };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (adminError) {
    return {
      status: "setup_error" as const,
      message: adminError.message,
      user,
    };
  }

  if (!admin) {
    return {
      status: "not_admin" as const,
      email: user.email || "",
      user,
    };
  }

  return { status: "admin" as const, user, admin };
}

export async function getCurrentAdmin() {
  const state = await getAdminAuthState();

  if (state.status !== "admin") {
    return null;
  }

  return { user: state.user, admin: state.admin };
}
