import { FeaturedDishes } from "@/components/public/featured-dishes";
import { HomeHero } from "@/components/public/home-hero";
import { LocationSection } from "@/components/public/location-section";
import { ButtonLink } from "@/components/ui/button";
import { getFeaturedMenuItems } from "@/lib/data/menu";
import { getSiteSettings } from "@/lib/data/settings";

export default async function HomePage() {
  const [settings, featuredItems] = await Promise.all([getSiteSettings(), getFeaturedMenuItems()]);

  return (
    <>
      <HomeHero settings={settings} />
      <FeaturedDishes items={featuredItems} />
      <LocationSection settings={settings} />
      <section className="bg-ink py-20">
        <div className="site-shell text-center">
          <p className="eyebrow mb-4">Tonight at Pasha</p>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold text-ivory md:text-6xl">
            Reserve a quiet table or take the food home.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/book">Book a table</ButtonLink>
            <ButtonLink href="/menu" variant="secondary">
              View menu
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
