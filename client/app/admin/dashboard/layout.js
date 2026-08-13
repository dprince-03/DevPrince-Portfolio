import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/admin/DashboardNav";
import DashboardHeaderActions from "@/components/admin/DashboardHeaderActions";

const INTERNAL_API_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getAdmin() {
  const cookieStore = await cookies();
  const res = await fetch(`${INTERNAL_API_URL}/api/auth/me`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardLayout({ children }) {
  const admin = await getAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-term-border px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-term-red" />
          <span className="h-3 w-3 rounded-full bg-term-gold" />
          <span className="h-3 w-3 rounded-full bg-term-green" />
          <span className="ml-3 text-sm text-term-silver">dashboard.json</span>
        </div>
        <DashboardHeaderActions email={admin.email} />
      </header>
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row">
        <DashboardNav />
        <main className="min-w-0 flex-1 px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
