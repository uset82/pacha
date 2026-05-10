import { CalendarCheck, Home, LogOut, Settings, Soup } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth-actions";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/menu", label: "Menu", icon: Soup },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <header className="border-b border-ivory/10 bg-ink/70">
        <div className="admin-shell flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="font-display text-2xl font-semibold text-ivory">
              Pacha Admin
            </Link>
            <p className="mt-1 text-sm text-mist">Signed in as {email}</p>
          </div>
          <form action={signOut}>
            <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-2 text-sm font-semibold text-ivory transition hover:border-brass hover:text-brass">
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="admin-shell grid gap-8 py-8 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-8 md:self-start">
          <nav className="grid gap-2">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-mist transition hover:bg-ivory/5 hover:text-brass"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main id="main">{children}</main>
      </div>
    </div>
  );
}
