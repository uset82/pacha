import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { siteDetails } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-ivory/10 bg-charcoal">
      <div className="site-shell grid gap-10 py-14 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <p className="eyebrow mb-4">Visit</p>
          <h2 className="max-w-md font-display text-4xl font-semibold leading-tight text-ivory">{siteDetails.name}</h2>
          <p className="mt-4 max-w-md text-mist">{siteDetails.location}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/book">Book a table</ButtonLink>
            <a href={settings.foodora_url} className="focus-ring inline-flex rounded-full border border-ivory/30 px-5 py-3 text-sm font-semibold text-ivory transition hover:border-brass hover:text-brass">
              Order via Foodora
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-mist">
            <li>
              <a href={siteDetails.phoneHref} className="transition hover:text-brass">
                {siteDetails.phone}
              </a>
            </li>
            <li>
              <a href={siteDetails.emailHref} className="transition hover:text-brass">
                {siteDetails.email}
              </a>
            </li>
            <li>
              <a href={siteDetails.instagramUrl} className="transition hover:text-brass">
                {siteDetails.socialHandle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Hours</p>
          <p className="text-sm leading-7 text-mist">{settings.opening_hours}</p>
          <Link href="/admin/login" className="mt-8 inline-flex text-xs text-mist/50 transition hover:text-brass">
            Owner login
          </Link>
        </div>
      </div>
    </footer>
  );
}
