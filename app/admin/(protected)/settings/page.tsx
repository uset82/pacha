import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Admin Settings",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Settings</p>
        <h1 className="font-display text-5xl font-semibold text-ivory">Site copy and links.</h1>
        <p className="mt-4 max-w-2xl text-mist">
          Control the public hero, Foodora URL, hours, and social preview image.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
