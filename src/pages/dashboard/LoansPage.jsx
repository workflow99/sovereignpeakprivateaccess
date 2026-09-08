import { useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAppStore } from "../../store/AppStoreContext";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function LoansPage() {
  const { state, requestLoan } = useAppStore();
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("12 months");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    requestLoan({ amount: value, term, purpose: purpose || "Unspecified" });
    setAmount("");
    setPurpose("");
  };

  return (
    <>
      <PageHeader title="Loans" description="Borrow against your portfolio value." />

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 sm:px-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5 sm:p-6">
          <label className="block">
            <span className="text-xs font-medium text-[#B3B3B3]">Loan Amount (USD)</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Term</span>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            >
              {["6 months", "12 months", "24 months"].map((t) => (
                <option key={t} value={t} className="bg-[#0a0a0c]">
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Purpose (optional)</span>
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Real estate down payment"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </label>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white"
          >
            Request Loan
          </button>
        </form>

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <span className="text-sm font-medium text-white">Your Loans</span>
          <div className="mt-3 space-y-3">
            {state.loans.length === 0 && <p className="text-sm text-[#B3B3B3]">No loan requests yet.</p>}
            {state.loans.map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <p className="text-sm font-medium text-white">{currency(l.amount)} &middot; {l.term}</p>
                  <p className="text-xs text-[#B3B3B3]">{l.purpose}</p>
                </div>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-400">
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
