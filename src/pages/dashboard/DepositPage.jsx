import { useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAppStore } from "../../store/AppStoreContext";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const METHODS = ["Bank Transfer", "Debit Card", "Wire Transfer"];

export default function DepositPage() {
  const { state, addFunds } = useAppStore();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0]);
  const [message, setMessage] = useState("");

  const deposits = state.transactions.filter((t) => t.type === "deposit");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    addFunds(value, method);
    setAmount("");
    setMessage(`$${value.toLocaleString()} deposited via ${method}.`);
  };

  return (
    <>
      <PageHeader title="Deposit" description="Add funds to your buying power." />

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 sm:px-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5 sm:p-6">
          <label className="block">
            <span className="text-xs font-medium text-[#B3B3B3]">Amount (USD)</span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Method</span>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            >
              {METHODS.map((m) => (
                <option key={m} value={m} className="bg-[#0a0a0c]">
                  {m}
                </option>
              ))}
            </select>
          </label>

          {message && <p className="mt-3 text-xs text-emerald-400">{message}</p>}

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white"
          >
            Deposit Funds
          </button>
        </form>

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <span className="text-sm font-medium text-white">Recent Deposits</span>
          <div className="mt-3 space-y-3">
            {deposits.length === 0 && <p className="text-sm text-[#B3B3B3]">No deposits yet.</p>}
            {deposits.map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <p className="text-sm font-medium text-white">{t.label}</p>
                  <p className="text-xs text-[#B3B3B3]">{t.date}</p>
                </div>
                <span className="text-sm font-medium text-emerald-400">+{currency(t.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
