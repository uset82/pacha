import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatNok } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";
import type { MenuItem } from "@/lib/types";

export function FeaturedDishes({ items }: { items: MenuItem[] }) {
  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="site-shell">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div className="slow-reveal">
            <p className="eyebrow mb-4">Signature plates</p>
            <h2 className="section-title">A luxurious culinary journey.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-mist md:justify-self-end">
            Authentic Peruvian specials, traditional Turkish flavors, and generous international dishes served with warm Bergen hospitality.
          </p>
        </div>

        <div className="mt-14 divide-y divide-ivory/15 border-y border-ivory/15">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href="/menu"
              className="group grid gap-6 py-7 transition hover:bg-ivory/[0.03] md:grid-cols-[180px_1fr_auto] md:items-center"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-charcoal md:aspect-[5/4]">
                <Image
                  src={resolveImageUrl(item.image_path)}
                  alt={item.image_alt || item.name}
                  fill
                  sizes="(min-width: 768px) 180px, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <p className="text-sm text-brass">0{index + 1} · {item.category}</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-ivory">{item.name}</h3>
                <p className="mt-3 max-w-2xl leading-7 text-mist">{item.description}</p>
              </div>
              <div className="flex items-center gap-4 text-brass">
                <span className="text-lg font-semibold">{formatNok(item.price_nok)}</span>
                <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
