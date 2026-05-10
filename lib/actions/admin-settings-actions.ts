"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

const settingsSchema = z.object({
  hero_headline: z.string().trim().min(2, "Hero headline is required."),
  hero_subcopy: z.string().trim().min(4, "Hero subcopy is required."),
  foodora_url: z.string().trim().url("Foodora URL must be a valid URL."),
  opening_hours: z.string().trim().min(3, "Opening hours are required."),
  hero_image_path: z.string().trim().optional(),
  og_image_path: z.string().trim().optional(),
});

export async function updateSiteSettings(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = settingsSchema.safeParse({
    hero_headline: formData.get("hero_headline"),
    hero_subcopy: formData.get("hero_subcopy"),
    foodora_url: formData.get("foodora_url"),
    opening_hours: formData.get("opening_hours"),
    hero_image_path: formData.get("hero_image_path"),
    og_image_path: formData.get("og_image_path"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Check settings." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const { error } = await supabase.from("site_settings").upsert({
    id: "main",
    ...parsed.data,
    hero_image_path: parsed.data.hero_image_path || null,
    og_image_path: parsed.data.og_image_path || null,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Settings updated." };
}
