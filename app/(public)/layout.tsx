import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteSettings } from "@/lib/data/settings";

export const revalidate = 300;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader foodoraUrl={settings.foodora_url} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
