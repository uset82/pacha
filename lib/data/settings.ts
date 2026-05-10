import { fallbackSettings } from "@/lib/site";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { SiteSettings } from "@/lib/types";

export async function getSiteSettings() {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return fallbackSettings;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    console.error("Failed to load site settings", error.message);
    return fallbackSettings;
  }

  return (data || fallbackSettings) as SiteSettings;
}
