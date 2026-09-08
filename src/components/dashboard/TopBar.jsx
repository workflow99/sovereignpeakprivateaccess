import { Link } from "react-router-dom";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useAppStore } from "../../store/AppStoreContext";
import Avatar from "./Avatar";

export default function TopBar({ onToggleSidebar }) {
  const { state } = useAppStore();
  const unread = state.notifications.filter((n) => !n.read).length;

  return (
    <div className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-8">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
      >
        <Menu size={17} />
      </button>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D62839] text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </Link>

        <Link
          to="/dashboard/settings"
          className="flex items-center gap-2 rounded-full border border-white/10 py-1.5 pr-3 pl-1.5 transition-colors hover:border-white/20"
        >
          <Avatar name={state.profile.name} avatarUrl={state.profile.avatarUrl} size={28} className="text-xs" />
          <span className="hidden text-sm font-medium text-white sm:inline">{state.profile.name}</span>
          <ChevronDown size={14} className="text-[#B3B3B3]" />
        </Link>
      </div>
    </div>
  );
}
