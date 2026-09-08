import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Banknote,
  Bell,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  LogOut,
  Receipt,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import Logo from "../Logo";
import { useAppStore } from "../../store/AppStoreContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", end: true },
  { label: "My Portfolio", icon: Wallet, to: "/dashboard/portfolio" },
  { label: "Transactions", icon: Receipt, to: "/dashboard/transactions" },
  { label: "Cards Coming Soon", icon: CreditCard, to: "/dashboard/cards", disabled: true },
  { label: "Deposit", icon: Banknote, action: "deposit" },
  { label: "Loans Coming Soon", icon: HandCoins, to: "/dashboard/loans", disabled: true },
  { label: "Link Retirement Account", icon: Link2, to: "/dashboard/link" },
];

const FOOTER_ITEMS = [
  { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
  { label: "Settings", icon: Settings, to: "/dashboard/settings" },
  { label: "Support", icon: LifeBuoy, to: "/dashboard/support" },
];

function NavItem({ item, onNavigate, onDeposit }) {
  if (item.disabled) {
    return (
      <span
        aria-disabled="true"
        title="Coming soon"
        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5a5a5a]"
      >
        <item.icon size={17} />
        {item.label}
      </span>
    );
  }

  if (item.action === "deposit") {
    return (
      <button
        type="button"
        onClick={() => {
          onDeposit?.();
          onNavigate?.();
        }}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-white/5 hover:text-white"
      >
        <item.icon size={17} />
        {item.label}
      </button>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
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
  );
}

export default function DashboardSidebar({ open, onClose, onDeposit }) {
  const { logOut } = useAppStore();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    onClose?.();
    // Clearing the session makes RequireAuth redirect to /login on its own
    // render pass — an imperative navigate("/") issued in the same tick
    // loses that race. Deferring to the next tick lets RequireAuth's
    // redirect land first, then this one wins (replace: true), so the
    // final URL is always the landing page, not /login.
    setTimeout(() => navigate("/", { replace: true }), 0);
  };

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
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col overflow-y-auto border-r border-[rgba(177,18,38,0.16)] bg-[#0a0a0a] px-4 py-6 transition-transform duration-300 lg:static lg:h-screen lg:shrink-0 lg:overflow-y-hidden lg:transition-[width,padding,border-color] ${
          open
            ? "translate-x-0 lg:w-72 lg:px-4"
            : "-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:border-r-0 lg:px-0"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>
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
            <NavItem key={item.label} item={item} onNavigate={onClose} onDeposit={onDeposit} />
          ))}
        </nav>

        <div className="mt-6 flex flex-col gap-1 border-t border-[rgba(177,18,38,0.12)] pt-4">
          {FOOTER_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} onNavigate={onClose} />
          ))}
          <button
            type="button"
            onClick={handleLogOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={17} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
