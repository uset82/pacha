import type { Metadata } from "next";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { getMenuItems } from "@/lib/data/menu";

export const metadata: Metadata = {
  title: "Admin Menu",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMenuPage() {
  const items = await getMenuItems({ includeInactive: true });

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Menu manager</p>
        <h1 className="font-display text-5xl font-semibold text-ivory">Dishes, prices, images.</h1>
        <p className="mt-4 max-w-2xl text-mist">
          New uploads are stored in Supabase Storage with public reads and admin-only writes.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-display text-3xl font-semibold">Create new item</h2>
        <MenuItemForm />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl font-semibold">Existing items</h2>
        {items.length === 0 ? (
          <div className="admin-panel text-mist">No menu items yet.</div>
        ) : (
          <div className="space-y-5">
            {items.map((item) => (
              <MenuItemForm key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
