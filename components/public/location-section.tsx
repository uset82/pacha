import { Clock, Instagram, MapPin } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { siteDetails } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export function LocationSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-emerald py-20 md:py-28">
      <div className="site-shell grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="relative min-h-[520px] overflow-hidden rounded-md">
          <Image
            src="/images/empanadas.jpg"
            alt="Peruvian empanadas served at Pacha International Food"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        </div>

        <div>
          <p className="eyebrow mb-4">Atmosphere</p>
          <h2 className="section-title">An intimate stop for international flavor in Bergen.</h2>
          <p className="mt-6 text-lg leading-8 text-mist">
            A compact dining experience built around warm service, grilled plates, Peruvian specials, and a calm evening rhythm at Strandgaten.
          </p>

          <dl className="mt-10 grid gap-5 text-sm text-mist">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-brass" />
              <div>
                <dt className="font-semibold text-ivory">Address</dt>
                <dd>{siteDetails.location}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 size-5 shrink-0 text-brass" />
              <div>
                <dt className="font-semibold text-ivory">Opening hours</dt>
                <dd>{settings.opening_hours}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Instagram className="mt-1 size-5 shrink-0 text-brass" />
              <div>
                <dt className="font-semibold text-ivory">Social</dt>
                <dd>
                  <a href={siteDetails.instagramUrl} className="transition hover:text-brass">
                    {siteDetails.socialHandle}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-10">
            <ButtonLink href="/book">Reserve your table</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
