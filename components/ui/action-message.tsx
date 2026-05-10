import { clsx } from "clsx";
import type { ActionState } from "@/lib/types";

export function ActionMessage({ state }: { state: ActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={clsx(
        "rounded-lg border px-4 py-3 text-sm",
        state.ok ? "border-brass/40 bg-brass/10 text-ivory" : "border-terracotta/50 bg-terracotta/10 text-ivory",
      )}
    >
      {state.message}
    </p>
  );
}
