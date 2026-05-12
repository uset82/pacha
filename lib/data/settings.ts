import { applyCurrentBranding, fallbackSettings } from "@/lib/site";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isMissingRelationError } from "@/lib/supabase/errors";
import type { SiteSettings } from "@/lib/types";

export async function getSiteSettings() {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return applyCurrentBranding(fallbackSettings);
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    if (!isMissingRelationError(error)) {
      console.warn("Using fallback site settings because Supabase returned an error:", error.message);
    }

    return applyCurrentBranding(fallbackSettings);
  }

  return applyCurrentBranding((data || fallbackSettings) as SiteSettings);
}

export async function getAdminSiteSettings() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      settings: applyCurrentBranding(fallbackSettings),
      error: "Supabase is not configured. Add the Supabase URL and publishable or anon key before editing site settings.",
    };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    return {
      settings: applyCurrentBranding(fallbackSettings),
      error: `Site settings could not be loaded: ${error.message}`,
    };
  }

  return {
    settings: applyCurrentBranding((data || fallbackSettings) as SiteSettings),
    error: null,
  };
}
