"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteStoredImage, uploadImageFromForm } from "@/lib/actions/media-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

const settingsSchema = z.object({
  hero_headline: z.string().trim().min(2, "Hero headline is required."),
  hero_subcopy: z.string().trim().min(4, "Hero subcopy is required."),
  foodora_url: z.string().trim().url("Foodora URL must be a valid URL."),
  opening_hours: z.string().trim().min(3, "Opening hours are required."),
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
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Check settings." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const existingHeroImagePath = String(formData.get("existing_hero_image_path") || "") || null;
  const existingOgImagePath = String(formData.get("existing_og_image_path") || "") || null;
  const removeHeroImage = formData.get("remove_hero_image") === "on";
  const removeOgImage = formData.get("remove_og_image") === "on";
  const heroUpload = await uploadImageFromForm(supabase, formData, "hero_image", "site");

  if (heroUpload.error) {
    return { ok: false, message: heroUpload.error };
  }

  const ogUpload = await uploadImageFromForm(supabase, formData, "og_image", "site");

  if (ogUpload.error) {
    await deleteStoredImage(supabase, heroUpload.path);
    return { ok: false, message: ogUpload.error };
  }

  const heroImagePath = heroUpload.path || (removeHeroImage ? null : existingHeroImagePath);
  const ogImagePath = ogUpload.path || (removeOgImage ? null : existingOgImagePath);
  const { error } = await supabase.from("site_settings").upsert({
    id: "main",
    ...parsed.data,
    hero_image_path: heroImagePath,
    og_image_path: ogImagePath,
  });

  if (error) {
    await deleteStoredImage(supabase, heroUpload.path);
    await deleteStoredImage(supabase, ogUpload.path);
    return { ok: false, message: error.message };
  }

  const remainingPaths = new Set([heroImagePath, ogImagePath].filter(Boolean));

  for (const previousPath of [existingHeroImagePath, existingOgImagePath]) {
    if (previousPath && !remainingPaths.has(previousPath)) {
      await deleteStoredImage(supabase, previousPath);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Settings updated." };
}
