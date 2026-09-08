import { useState } from "react";
import { Eye, EyeOff, Wallet } from "lucide-react";
import TrendChart from "../TrendChart";
import { chartTrend } from "../../data/mockPortfolio";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function StatsRow({ changePercent, changeAmount, buyingPower, onAddFunds }) {
  const [hidden, setHidden] = useState(false);
  const positive = changeAmount >= 0;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center gap-1.5 text-xs text-[#B3B3B3]">
          Portfolio Performance
        </div>
        <p className={`mt-2 font-serif text-2xl ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </p>
        <p className="mt-1 text-xs text-[#B3B3B3]">
          {positive ? "+" : ""}
          {currency(changeAmount)} &middot; Year to Date
        </p>
        <div className="mt-3 h-12">
          <TrendChart points={chartTrend} />
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#B3B3B3]">Buying Power</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(177,18,38,0.25)] bg-white/[0.03]">
            <Wallet size={16} className="text-[#D62839]" />
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <p className="font-serif text-2xl text-white">{hidden ? "••••••••" : currency(buyingPower)}</p>
          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? "Show buying power" : "Hide buying power"}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
          >
            {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <p className="mt-1 text-xs text-[#B3B3B3]">Available to Invest</p>
        <button
          type="button"
          onClick={onAddFunds}
          className="mt-4 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          Add Funds
        </button>
      </div>
    </div>
  );
}
