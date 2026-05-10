"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { requestMagicLink } from "@/lib/actions/auth-actions";
import { ActionMessage } from "@/components/ui/action-message";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction] = useActionState(requestMagicLink, initialState);

  return (
    <form action={formAction} className="admin-panel space-y-5">
      <label className="block space-y-2">
        <span className="label inline-flex items-center gap-2">
          <Mail className="size-4 text-brass" />
          Owner email
        </span>
        <input className="field" name="email" type="email" autoComplete="email" required />
      </label>
      <ActionMessage state={state} />
      <SubmitButton pendingText="Sending link...">Send magic link</SubmitButton>
    </form>
  );
}
