import type { Metadata } from "next";
import { MenuList } from "@/components/public/menu-list";
import { getMenuItems } from "@/lib/data/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore the Pacha International Food menu in Bergen.",
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <section className="bg-ink pb-20 pt-36 md:pt-44">
      <div className="site-shell">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Menu</p>
          <h1 className="section-title">International comfort, grilled plates, and Peruvian specials.</h1>
          <p className="mt-6 text-lg leading-8 text-mist">
            Prices and availability can be updated by the owner from the admin dashboard.
          </p>
        </div>
        <div className="mt-14">
          <MenuList items={items} />
        </div>
      </div>
    </section>
  );
}
