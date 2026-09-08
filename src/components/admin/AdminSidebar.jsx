import { Link, NavLink } from "react-router-dom";
import {
  BarChart3,
  MessageSquare,
  Shield,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", icon: BarChart3, to: "/superadmin", end: true },
  { label: "Users", icon: Users, to: "/superadmin/users" },
  { label: "Support Chat", icon: MessageSquare, to: "/superadmin/chat" },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-[rgba(177,18,38,0.16)] bg-[#0a0a0a] px-4 py-6 transition-transform duration-300 lg:static lg:shrink-0 lg:transition-[width,padding,border-color] ${
          open
            ? "translate-x-0 lg:w-72 lg:px-4"
            : "-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:border-r-0 lg:px-0"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(177,18,38,0.4)] bg-gradient-to-br from-[#1a0507] to-[#050505]">
              <Shield size={15} className="text-[#EF4444]" />
            </span>
            <span className="font-serif text-sm tracking-[0.08em] text-white">
              SUPER<span className="text-[#D62839]">ADMIN</span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] lg:hidden"
          >
            <X size={15} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[rgba(177,18,38,0.14)] text-white"
                    : "text-[#B3B3B3] hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={17} className={isActive ? "text-[#EF4444]" : ""} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-[rgba(177,18,38,0.12)] pt-4">
          <Link
            to="/dashboard"
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-white/5 hover:text-white"
          >
            View Investor Dashboard
          </Link>
          <Link
            to="/"
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-white/5 hover:text-white"
          >
            View Landing Page
          </Link>
        </div>
      </aside>
    </>
  );
}
