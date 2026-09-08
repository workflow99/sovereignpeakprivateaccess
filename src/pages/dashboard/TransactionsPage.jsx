import { useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAppStore } from "../../store/AppStoreContext";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const TYPE_LABEL = {
  deposit: "Deposit",
  buy: "Buy",
  transfer: "Transfer",
  rebalance: "Rebalance",
};

const FILTERS = ["All", "Deposit", "Buy"];

const STATUS_STYLE = {
  completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  failed: "border-red-400/30 bg-red-400/10 text-red-400",
};

export default function TransactionsPage() {
  const { state } = useAppStore();
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? state.transactions
      : state.transactions.filter((t) => TYPE_LABEL[t.type] === filter);

  return (
    <>
      <PageHeader title="Transactions" description="A complete record of activity on your account." />

      <div className="mt-6 px-6 sm:px-8">
        <div className="mb-4 flex flex-wrap gap-1 rounded-full border border-white/10 p-1 sm:inline-flex">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-[#D62839] text-white" : "text-[#B3B3B3] hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-[#B3B3B3]">No transactions in this category yet.</p>
          )}

          {filtered.length > 0 && (
            <>
              {/* Card list below sm — every field is fully visible with no need to scroll the box sideways. */}
              <div className="divide-y divide-white/5 sm:hidden">
                {filtered.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{t.label}</p>
                      <p className="mt-0.5 text-xs text-[#B3B3B3]">
                        {TYPE_LABEL[t.type] ?? t.type} &middot; {t.date}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span
                        className={`text-sm font-medium ${
                          t.amount === 0 ? "text-[#B3B3B3]" : t.amount > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {t.amount > 0 ? "+" : ""}
                        {currency(t.amount)}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${
                          STATUS_STYLE[t.status] ?? "border-white/15 bg-white/[0.04] text-[#B3B3B3]"
                        }`}
                      >
                        {t.status ?? "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table from sm up — fluid width, no min-width, so it never needs horizontal scroll. */}
              <table className="hidden w-full border-collapse text-sm sm:table">
                <thead>
                  <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-[#B3B3B3]">
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b border-white/5">
                      <td className="py-3.5 font-medium text-white">{t.label}</td>
                      <td className="text-[#B3B3B3]">{TYPE_LABEL[t.type] ?? t.type}</td>
                      <td className="text-[#B3B3B3]">{t.date}</td>
                      <td>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${
                            STATUS_STYLE[t.status] ?? "border-white/15 bg-white/[0.04] text-[#B3B3B3]"
                          }`}
                        >
                          {t.status ?? "—"}
                        </span>
                      </td>
                      <td
                        className={`text-right font-medium ${
                          t.amount === 0 ? "text-[#B3B3B3]" : t.amount > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {t.amount > 0 ? "+" : ""}
                        {currency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}
