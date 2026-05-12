"use client";

import { useActionState, useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import { requestMagicLink, signInWithPassword } from "@/lib/actions/auth-actions";
import { ActionMessage } from "@/components/ui/action-message";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState = { ok: false, message: "" };

type Mode = "password" | "magic";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("password");
  const [passwordState, passwordAction] = useActionState(signInWithPassword, initialState);
  const [magicState, magicAction] = useActionState(requestMagicLink, initialState);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-full bg-charcoal/60 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === "password" ? "bg-brass/20 text-ivory" : "text-mist hover:text-ivory"
          }`}
          aria-pressed={mode === "password"}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === "magic" ? "bg-brass/20 text-ivory" : "text-mist hover:text-ivory"
          }`}
          aria-pressed={mode === "magic"}
        >
          Magic link
        </button>
      </div>

      {mode === "password" ? (
        <form action={passwordAction} className="admin-panel space-y-5">
          <label className="block space-y-2">
            <span className="label inline-flex items-center gap-2">
              <Mail className="size-4 text-brass" />
              Owner email
            </span>
            <input
              className="field"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="label inline-flex items-center gap-2">
              <KeyRound className="size-4 text-brass" />
              Password
            </span>
            <input
              className="field"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
            />
          </label>
          <ActionMessage state={passwordState} />
          <SubmitButton pendingText="Signing in...">Sign in</SubmitButton>
        </form>
      ) : (
        <form action={magicAction} className="admin-panel space-y-5">
          <label className="block space-y-2">
            <span className="label inline-flex items-center gap-2">
              <Mail className="size-4 text-brass" />
              Owner email
            </span>
            <input
              className="field"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <ActionMessage state={magicState} />
          <SubmitButton pendingText="Sending link...">Send magic link</SubmitButton>
        </form>
      )}
    </div>
  );
}
