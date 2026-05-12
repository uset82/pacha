type SupabaseLikeError = {
  code?: string;
  message?: string;
};

export function isMissingRelationError(error: SupabaseLikeError) {
  const message = error.message || "";

  return (
    error.code === "PGRST205" ||
    message.includes("schema cache") ||
    message.includes("Could not find the table") ||
    message.includes("does not exist")
  );
}
