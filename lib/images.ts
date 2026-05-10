import { mediaBucket } from "@/lib/env";

export function resolveImageUrl(path: string | null | undefined, fallback = "/images/polloalaparrila.jpg") {
  if (!path) {
    return fallback;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return fallback;
  }

  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${mediaBucket}/${path}`;
}

export function fileNameFromPath(path: string | null | undefined) {
  if (!path) {
    return "No image";
  }

  return path.split("/").pop() || path;
}
