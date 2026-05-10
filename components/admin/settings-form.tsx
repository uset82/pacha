"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/lib/actions/admin-settings-actions";
import { ActionMessage } from "@/components/ui/action-message";
import { SubmitButton } from "@/components/ui/submit-button";
import type { SiteSettings } from "@/lib/types";

const initialState = { ok: false, message: "" };

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(updateSiteSettings, initialState);

  return (
    <form action={formAction} className="admin-panel space-y-5">
      <label className="block space-y-2">
        <span className="label">Hero headline</span>
        <input className="field" name="hero_headline" defaultValue={settings.hero_headline} required />
      </label>
      <label className="block space-y-2">
        <span className="label">Hero subcopy</span>
        <textarea className="field min-h-24 resize-y" name="hero_subcopy" defaultValue={settings.hero_subcopy} required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Foodora URL</span>
          <input className="field" name="foodora_url" type="url" defaultValue={settings.foodora_url} required />
        </label>
        <label className="space-y-2">
          <span className="label">Opening hours</span>
          <input className="field" name="opening_hours" defaultValue={settings.opening_hours} required />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Hero image path</span>
          <input className="field" name="hero_image_path" defaultValue={settings.hero_image_path || ""} />
        </label>
        <label className="space-y-2">
          <span className="label">OG image path</span>
          <input className="field" name="og_image_path" defaultValue={settings.og_image_path || ""} />
        </label>
      </div>
      <ActionMessage state={state} />
      <SubmitButton pendingText="Updating settings...">Update settings</SubmitButton>
    </form>
  );
}
