import { ArrowRight, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { resolveImageUrl } from "@/lib/images";
import { siteDetails } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export function HomeHero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-ink">
      <Image
        src={resolveImageUrl(settings.hero_image_path, "/images/polloalaparrila.jpg")}
        alt=""
        fill
        sizes="100vw"
        className="hero-image-motion object-cover object-[62%_50%] opacity-90"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,6,0.98)_0%,rgba(7,7,6,0.92)_34%,rgba(7,7,6,0.55)_68%,rgba(7,7,6,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,6,0.4)_0%,rgba(7,7,6,0.02)_34%,rgba(7,7,6,0.92)_100%)]" />

      <div className="site-shell relative flex min-h-[92svh] items-end pb-14 pt-32 md:pb-20">
        <div className="max-w-2xl reveal-up">
          <p className="eyebrow mb-5">Strandgaten 85 · Bergen</p>
          <h1
            aria-label={siteDetails.name}
            className="font-display text-7xl font-semibold leading-[0.78] text-ivory md:text-[9rem] lg:text-[11rem]"
          >
            {siteDetails.displayName}
          </h1>
          <div className="mt-5 flex max-w-lg items-center gap-4">
            <span className="h-px flex-1 bg-brass/70" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brass md:text-sm">
              {siteDetails.descriptor}
            </p>
          </div>
          <p className="mt-7 max-w-lg text-lg leading-8 text-mist md:text-xl">{settings.hero_subcopy}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/book">
              Book a table
              <ArrowRight className="size-4" />
            </ButtonLink>
            <a href={settings.foodora_url} className="focus-ring inline-flex items-center justify-center rounded-full border border-ivory/35 px-5 py-3 text-sm font-semibold text-ivory transition hover:border-brass hover:text-brass">
              Order via Foodora
            </a>
          </div>
          <div className="mt-9 flex flex-wrap gap-5 text-sm text-mist">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-brass" />
              {siteDetails.location}
            </span>
            <Link href={siteDetails.phoneHref} className="inline-flex items-center gap-2 transition hover:text-brass">
              <Phone className="size-4 text-brass" />
              {siteDetails.phone}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
