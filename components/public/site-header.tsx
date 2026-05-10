import { Menu, Utensils } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { siteDetails } from "@/lib/site";

export function SiteHeader({ foodoraUrl }: { foodoraUrl: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ivory/10 bg-ink/60 backdrop-blur-md">
      <div className="site-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full">
          <span className="grid size-11 place-items-center rounded-full border border-brass/50 bg-ink font-display text-lg font-semibold text-brass">
            PC
          </span>
          <span className="font-display text-xl font-semibold text-ivory">{siteDetails.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ivory/80 md:flex">
          <Link href="/menu" className="transition hover:text-brass">
            Menu
          </Link>
          <Link href="/book" className="transition hover:text-brass">
            Book
          </Link>
          <a href={siteDetails.phoneHref} className="transition hover:text-brass">
            {siteDetails.phone}
          </a>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <ButtonLink href="/book" variant="secondary" className="px-4 py-2">
            Book
          </ButtonLink>
          <a href={foodoraUrl} className="focus-ring rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ivory">
            Foodora
          </a>
        </div>

        <Link href="/menu" className="focus-ring rounded-full border border-ivory/20 p-3 text-ivory md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Link>
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-ivory/10 bg-ink/75 px-4 py-2 text-xs text-mist sm:hidden">
        <Utensils className="size-3.5 text-brass" />
        <Link href="/book" className="font-semibold text-brass">
          Book a table
        </Link>
        <span aria-hidden="true">·</span>
        <a href={foodoraUrl} className="font-semibold text-brass">
          Order via Foodora
        </a>
      </div>
    </header>
  );
}
