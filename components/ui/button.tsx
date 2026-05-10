import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function buttonClassName(variant: ButtonVariant = "primary", className?: string) {
  return clsx(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
    variant === "primary" && "bg-brass text-ink hover:bg-ivory",
    variant === "secondary" && "border border-ivory/35 text-ivory hover:border-brass hover:text-brass",
    variant === "ghost" && "text-ivory/80 hover:text-brass",
    variant === "danger" && "border border-terracotta/70 text-ivory hover:bg-terracotta",
    className,
  );
}

export function ButtonLink({
  href,
  children,
  variant,
  className,
  ...props
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClassName(variant, className)} {...props}>
      {children}
    </Link>
  );
}
