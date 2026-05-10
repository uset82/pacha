import { CalendarClock, CheckCircle2, EyeOff, Soup } from "lucide-react";
import Link from "next/link";
import { getMenuItems } from "@/lib/data/menu";
import { getReservations } from "@/lib/data/reservations";

export default async function AdminOverviewPage() {
  const [menuItems, reservations] = await Promise.all([
    getMenuItems({ includeInactive: true }),
    getReservations(),
  ]);
  const activeItems = menuItems.filter((item) => item.active).length;
  const hiddenItems = menuItems.length - activeItems;
  const pendingReservations = reservations.filter((reservation) => reservation.status === "requested").length;

  const stats = [
    { label: "Active dishes", value: activeItems, icon: Soup },
    { label: "Hidden dishes", value: hiddenItems, icon: EyeOff },
    { label: "Pending reservations", value: pendingReservations, icon: CalendarClock },
    { label: "Confirmed", value: reservations.filter((reservation) => reservation.status === "confirmed").length, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Overview</p>
        <h1 className="font-display text-5xl font-semibold text-ivory">Restaurant control room.</h1>
        <p className="mt-4 max-w-2xl text-mist">
          Manage menu publishing, booking requests, and public site settings from one compact admin surface.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-panel">
              <Icon className="size-5 text-brass" />
              <p className="mt-5 text-3xl font-semibold text-ivory">{stat.value}</p>
              <p className="mt-1 text-sm text-mist">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/menu" className="admin-panel block transition hover:border-brass/60">
          <p className="eyebrow mb-3">Menu</p>
          <h2 className="font-display text-3xl font-semibold">Update dishes and prices</h2>
          <p className="mt-3 text-sm leading-6 text-mist">Create, hide, feature, or reorder dishes shown on the public site.</p>
        </Link>
        <Link href="/admin/reservations" className="admin-panel block transition hover:border-brass/60">
          <p className="eyebrow mb-3">Bookings</p>
          <h2 className="font-display text-3xl font-semibold">Confirm reservations</h2>
          <p className="mt-3 text-sm leading-6 text-mist">Review requested tables and mark each as confirmed or cancelled.</p>
        </Link>
      </div>
    </div>
  );
}
