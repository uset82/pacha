import Image from "next/image";
import { formatNok } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";
import type { MenuItem } from "@/lib/types";

function groupItems(items: MenuItem[]) {
  return items.reduce<Record<string, MenuItem[]>>((groups, item) => {
    groups[item.category] ||= [];
    groups[item.category].push(item);
    return groups;
  }, {});
}

export function MenuList({ items, showInactive = false }: { items: MenuItem[]; showInactive?: boolean }) {
  const groups = groupItems(items);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-ivory/15 p-8 text-mist">
        No menu items are published yet.
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {Object.entries(groups).map(([category, categoryItems], groupIndex) => (
        <section key={category}>
          <div className="mb-5 flex items-end justify-between border-b border-ivory/15 pb-3">
            <h2 className="font-display text-3xl font-semibold text-ivory">{category}</h2>
            <span className="text-sm text-mist">{categoryItems.length} items</span>
          </div>
          <div className="divide-y divide-ivory/10">
            {categoryItems.map((item, itemIndex) => (
              <article
                key={item.id}
                className="group grid gap-5 py-6 md:grid-cols-[128px_1fr_auto] md:items-center"
              >
                <div className="relative aspect-[5/4] overflow-hidden rounded-md bg-charcoal">
                  <Image
                    src={resolveImageUrl(item.image_path)}
                    alt={item.image_alt || item.name}
                    fill
                    sizes="(min-width: 768px) 128px, 100vw"
                    priority={groupIndex === 0 && itemIndex === 0}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-2xl font-semibold text-ivory">{item.name}</h3>
                    {item.featured && <span className="status-pill border-brass/50 text-brass">Featured</span>}
                    {showInactive && !item.active && <span className="status-pill border-terracotta/50 text-terracotta">Hidden</span>}
                  </div>
                  <p className="mt-2 max-w-2xl leading-7 text-mist">{item.description}</p>
                </div>
                <p className="text-xl font-semibold text-brass">{formatNok(item.price_nok)}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
