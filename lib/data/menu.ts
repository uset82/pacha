import { fallbackMenuItems } from "@/lib/fallback-data";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isMissingRelationError } from "@/lib/supabase/errors";
import type { MenuItem } from "@/lib/types";

export async function getMenuItems(options: { includeInactive?: boolean } = {}) {
  const supabase = options.includeInactive
    ? await createSupabaseServerClient()
    : createSupabasePublicClient();
  const fallback = options.includeInactive
    ? fallbackMenuItems
    : fallbackMenuItems.filter((item) => item.active);

  if (!supabase) {
    return fallback;
  }

  let query = supabase.from("menu_items").select("*").order("sort_order", { ascending: true });

  if (!options.includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    if (!isMissingRelationError(error)) {
      console.warn("Using fallback menu items because Supabase returned an error:", error.message);
    }

    return fallback;
  }

  return (data || fallback) as MenuItem[];
}

export async function getFeaturedMenuItems() {
  const items = await getMenuItems();
  return items.filter((item) => item.featured).slice(0, 3);
}

export async function getAdminMenuItems() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      items: [] as MenuItem[],
      error: "Supabase is not configured. Add the Supabase URL and publishable or anon key before editing the CMS.",
    };
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return {
      items: [] as MenuItem[],
      error: `Menu items could not be loaded: ${error.message}`,
    };
  }

  return { items: (data || []) as MenuItem[], error: null };
}
