import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1024
  );

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-white">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0 flex-1 pb-20">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
          >
            <Menu size={17} />
          </button>

          <span className="rounded-full border border-[rgba(177,18,38,0.3)] bg-[rgba(177,18,38,0.08)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#EF9A9A]">
            Admin Mode
          </span>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
