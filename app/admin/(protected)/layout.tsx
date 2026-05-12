import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminAuthState } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const authState = await getAdminAuthState();

  if (authState.status !== "admin") {
    redirect(`/admin/login?reason=${authState.status}`);
  }

  return <AdminShell email={authState.admin.email}>{children}</AdminShell>;
}
