import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "../../store/AppStoreContext";
import DepositAddressModal from "./DepositAddressModal";
import WithdrawModal from "./WithdrawModal";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function PortfolioValueCard({ totalValue, changePercent, changeAmount, liveStatus }) {
  const { state } = useAppStore();
  const [hidden, setHidden] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const positive = changeAmount >= 0;

  return (
    <div className="relative h-full flex-1 overflow-hidden rounded-3xl border border-[rgba(177,18,38,0.2)] px-6 py-8 sm:px-10 sm:py-10">
      <div className="absolute inset-0 bg-[#0a0a0c]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 100% 0%, rgba(177,18,38,0.35), transparent 60%), radial-gradient(ellipse 60% 80% at 0% 100%, rgba(214,40,57,0.18), transparent 60%)",
        }}
      />
      <div className="grid-bg absolute inset-0 opacity-20" />

      <div className="relative">
        <div className="flex items-center gap-1.5 text-xs text-[#B3B3B3]">
          Total Portfolio Value
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              liveStatus === "live"
                ? "bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]"
                : "bg-[#B3B3B3]"
            }`}
          />
        </div>

        <div className="mt-1 flex items-center gap-3">
          <p className="font-serif text-3xl text-white sm:text-4xl">
            {hidden ? "••••••••" : currency(totalValue)}
          </p>
          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? "Show portfolio value" : "Hide portfolio value"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
          >
            {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <p className={`mt-1 text-sm font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {hidden
            ? "••••"
            : `${positive ? "+" : ""}${changePercent.toFixed(2)}% (${positive ? "+" : ""}${currency(
                changeAmount
              )}) Year to Date`}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDepositOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-4 py-2 text-xs font-semibold text-white transition-shadow hover:shadow-[0_0_16px_rgba(239,68,68,0.4)]"
          >
            <ArrowDownToLine size={13} />
            Deposit
          </button>
          <button
            type="button"
            onClick={() => setWithdrawOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/5"
          >
            <ArrowUpFromLine size={13} />
            Withdraw
          </button>
        </div>
      </div>

      <DepositAddressModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        address={state.profile.depositAddress}
      />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
    </div>
  );
}
