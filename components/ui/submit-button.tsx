"use client";

import { useFormStatus } from "react-dom";
import { clsx } from "clsx";
import { buttonClassName } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingText = "Saving...",
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(buttonClassName(variant, className), "disabled:cursor-not-allowed disabled:opacity-60")}
    >
      {pending ? pendingText : children}
    </button>
  );
}
