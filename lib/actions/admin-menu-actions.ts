"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { mediaBucket } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState, MenuItem } from "@/lib/types";

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

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

async function uploadImageIfProvided(formData: FormData) {
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return { path: null as string | null, error: null as string | null };
  }

  if (!allowedImageTypes.includes(image.type)) {
    return { path: null, error: "Images must be JPG, PNG, or WebP." };
  }

  if (image.size > maxImageSize) {
    return { path: null, error: "Images must be 5 MB or smaller." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { path: null, error: "Supabase is not configured, so images cannot be uploaded yet." };
  }

  const safeName = image.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `menu/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(mediaBucket).upload(path, image, {
    contentType: image.type,
    upsert: false,
  });

  if (error) {
    return { path: null, error: error.message };
  }

  return { path, error: null };
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

  const upload = await uploadImageIfProvided(formData);

  if (upload.error) {
    return { ok: false, message: upload.error };
  }

  const payload = menuPayloadFromForm(formData, upload.path);

  if (payload.error || !payload.data) {
    return { ok: false, message: payload.error || "Check the menu item." };
  }

  const { error } = await supabase.from("menu_items").insert(payload.data);

  if (error) {
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
  const supabase = await createSupabaseServerClient();

  if (!id) {
    return { ok: false, message: "Missing menu item id." };
  }

  if (!supabase) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const upload = await uploadImageIfProvided(formData);

  if (upload.error) {
    return { ok: false, message: upload.error };
  }

  const payload = menuPayloadFromForm(formData, upload.path || existingImagePath);

  if (payload.error || !payload.data) {
    return { ok: false, message: payload.error || "Check the menu item." };
  }

  const { error } = await supabase.from("menu_items").update(payload.data).eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
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

  await supabase.from("menu_items").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export type EditableMenuItem = MenuItem;
