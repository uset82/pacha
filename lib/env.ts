export const mediaBucket = "restaurant-media";

function cleanEnv(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function getSupabaseEnv() {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = cleanEnv(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function getSupabaseSecretKey() {
  return cleanEnv(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY) || null;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseEnv());
}
