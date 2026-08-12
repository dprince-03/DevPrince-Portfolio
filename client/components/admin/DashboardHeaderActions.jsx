"use client";

import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function DashboardHeaderActions({ email }) {
  const router = useRouter();

  async function handleLogout() {
    await authApi.logout();
    router.push("/admin/login");
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-term-silver-dim">{email}</span>
      <button
        type="button"
        onClick={handleLogout}
        className="text-xs text-term-silver transition-colors hover:text-term-red"
      >
        logout
      </button>
    </div>
  );
}
