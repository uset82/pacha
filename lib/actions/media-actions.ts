import type { SupabaseClient } from "@supabase/supabase-js";
import { mediaBucket } from "@/lib/env";
import { isStorageObjectPath } from "@/lib/images";
import type { Database } from "@/lib/types";

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImageFromForm(
  supabase: SupabaseClient<Database>,
  formData: FormData,
  fieldName: string,
  folder: string,
) {
  const image = formData.get(fieldName);

  if (!(image instanceof File) || image.size === 0) {
    return { path: null as string | null, error: null as string | null };
  }

  if (!allowedImageTypes.includes(image.type)) {
    return { path: null, error: "Images must be JPG, PNG, or WebP." };
  }

  if (image.size > maxImageSize) {
    return { path: null, error: "Images must be 5 MB or smaller." };
  }

  const safeName = image.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(mediaBucket).upload(path, image, {
    cacheControl: "3600",
    contentType: image.type,
    upsert: false,
  });

  if (error) {
    const friendly = describeStorageError(error.message);
    return { path: null, error: `Image upload failed: ${friendly}` };
  }

  return { path, error: null };
}

function describeStorageError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("database schema is out of sync")) {
    return "Supabase Storage is not initialized for this project yet. Open the Supabase dashboard, visit the Storage tab once so the tables get created, then save again.";
  }
  if (lower.includes("bucket not found")) {
    return "The `restaurant-media` bucket is missing. Re-run the storage migration after Storage is initialized.";
  }
  return message;
}

export async function deleteStoredImage(
  supabase: SupabaseClient<Database>,
  path: string | null | undefined,
) {
  if (!isStorageObjectPath(path)) {
    return null;
  }

  const objectPath = path;
  const { error } = await supabase.storage.from(mediaBucket).remove([objectPath]);
  return error ? error.message : null;
}
