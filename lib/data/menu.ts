import { fallbackMenuItems } from "@/lib/fallback-data";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
    console.error("Failed to load menu items", error.message);
    return fallback;
  }

  return (data || fallback) as MenuItem[];
}

export async function getFeaturedMenuItems() {
  const items = await getMenuItems();
  return items.filter((item) => item.featured).slice(0, 3);
}
