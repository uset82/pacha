"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteStoredImage, uploadImageFromForm } from "@/lib/actions/media-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState, MenuItem } from "@/lib/types";

const menuSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  slug: z.string().trim().optional(),
  description: z.string().trim().min(8, "Description is required."),
  price_nok: z.coerce.number().int().min(0, "Price must be 0 or higher."),
  category: z.string().trim().min(2, "Category is required."),
  image_alt: z.string().trim().optional(),
  sort_order: z.coerce.number().int().default(100),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function menuPayloadFromForm(formData: FormData, imagePath: string | null) {
  const parsed = menuSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price_nok: formData.get("price_nok"),
    category: formData.get("category"),
    image_alt: formData.get("image_alt"),
    sort_order: formData.get("sort_order"),
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message || "Check the menu item." };
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  if (!slug) {
    return { data: null, error: "A valid slug is required." };
  }

  return {
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      price_nok: parsed.data.price_nok,
      category: parsed.data.category,
      image_path: imagePath,
      image_alt: parsed.data.image_alt || null,
      featured: checkboxValue(formData, "featured"),
      active: checkboxValue(formData, "active"),
      sort_order: parsed.data.sort_order,
    },
    error: null,
  };
}

export async function createMenuItem(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const upload = await uploadImageFromForm(supabase, formData, "image", "menu");

  if (upload.error) {
    return { ok: false, message: upload.error };
  }

  const payload = menuPayloadFromForm(formData, upload.path);

  if (payload.error || !payload.data) {
    await deleteStoredImage(supabase, upload.path);
    return { ok: false, message: payload.error || "Check the menu item." };
  }

  const { error } = await supabase.from("menu_items").insert(payload.data);

  if (error) {
    await deleteStoredImage(supabase, upload.path);
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { ok: true, message: "Menu item created." };
}

export async function updateMenuItem(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") || "");
  const existingImagePath = String(formData.get("existing_image_path") || "") || null;
  const removeImage = checkboxValue(formData, "remove_image");
  const supabase = await createSupabaseServerClient();

  if (!id) {
    return { ok: false, message: "Missing menu item id." };
  }

  if (!supabase) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const upload = await uploadImageFromForm(supabase, formData, "image", "menu");

  if (upload.error) {
    return { ok: false, message: upload.error };
  }

  const imagePath = upload.path || (removeImage ? null : existingImagePath);
  const payload = menuPayloadFromForm(formData, imagePath);

  if (payload.error || !payload.data) {
    await deleteStoredImage(supabase, upload.path);
    return { ok: false, message: payload.error || "Check the menu item." };
  }

  const { error } = await supabase.from("menu_items").update(payload.data).eq("id", id);

  if (error) {
    await deleteStoredImage(supabase, upload.path);
    return { ok: false, message: error.message };
  }

  if ((upload.path || removeImage) && existingImagePath !== imagePath) {
    await deleteStoredImage(supabase, existingImagePath);
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { ok: true, message: "Menu item updated." };
}

export async function deleteMenuItem(formData: FormData) {
  const id = String(formData.get("id") || "");
  const supabase = await createSupabaseServerClient();

  if (!id || !supabase) {
    return;
  }

  const { data } = await supabase.from("menu_items").select("image_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (!error) {
    await deleteStoredImage(supabase, data?.image_path);
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export type EditableMenuItem = MenuItem;
