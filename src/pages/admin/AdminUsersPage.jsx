import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, Trash2, Users } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import Avatar from "../../components/dashboard/Avatar";
import { useAppStore } from "../../store/AppStoreContext";

const currency = (n) =>
  Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function AdminUsersPage() {
  const { state, adminDeleteUser } = useAppStore();
  const [query, setQuery] = useState("");

  const handleDelete = (e, u) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Permanently delete ${u.firstName} ${u.lastName}'s account? This cannot be undone.`)) {
      adminDeleteUser(u.id);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.users;
    return state.users.filter(
      (u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [state.users, query]);

  return (
    <>
      <PageHeader
        title="Users"
        description="Every investor who has signed up. Select a user to edit their dashboard."
      />

      <div className="mt-6 px-6 sm:px-8">
        <div className="relative mb-4 max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6a6a6a]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
          />
        </div>

        <div className="glass-panel overflow-hidden rounded-2xl">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <Users size={18} className="text-[#B3B3B3]" />
              </span>
              <p className="text-sm text-[#B3B3B3]">
                {state.users.length === 0 ? "No users have signed up yet." : "No users match your search."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((u) => {
                const dashboard = state.dashboardsByUser[u.id];
                const portfolioValue =
                  (dashboard?.balances.cash ?? 0) +
                  (dashboard?.otherAssetsValue ?? 0) +
                  (dashboard?.holdings.reduce((sum, h) => sum + h.quantity * h.avgCost, 0) ?? 0);
                return (
                  <Link
                    key={u.id}
                    to={`/superadmin/users/${u.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={`${u.firstName} ${u.lastName}`} size={36} className="shrink-0 text-sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="truncate text-xs text-[#B3B3B3]">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-white">{currency(portfolioValue)}</p>
                        <p className="text-[11px] text-[#B3B3B3]">Joined {u.joinDate}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, u)}
                        aria-label={`Delete ${u.firstName} ${u.lastName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#B3B3B3] transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                      <ChevronRight size={16} className="text-[#6a6a6a]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
