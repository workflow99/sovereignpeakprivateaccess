import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CRYPTO_ICONS } from "./icons/CryptoIcons";
import { portfolioSummary, holdings } from "../data/mockPortfolio";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function TickerItems() {
  const positive = portfolioSummary.monthlyChangePercent >= 0;

  return (
    <>
      {holdings.map((h) => {
        const Icon = CRYPTO_ICONS[h.symbol];
        const up = h.changePercent >= 0;
        return (
          <span key={h.symbol} className="flex shrink-0 items-center gap-2 px-6">
            {Icon && <Icon size={16} />}
            <span className="font-mono text-xs tracking-wide text-white">{h.symbol}</span>
            <span className="font-mono text-xs text-[#B3B3B3]">{currency(h.price)}</span>
            <span className={`flex items-center gap-0.5 font-mono text-xs ${up ? "text-emerald-400" : "text-red-400"}`}>
              {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {up ? "+" : ""}
              {h.changePercent.toFixed(2)}%
            </span>
          </span>
        );
      })}
      <span className="flex shrink-0 items-center gap-2 border-l border-white/10 px-6">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
        <span className="font-mono text-xs tracking-wide text-[#B3B3B3]">
          PRESIDENTIAL FUND NETWORK{" "}
          <span className={positive ? "text-emerald-400" : "text-red-400"}>
            {positive ? "+" : ""}
            {portfolioSummary.monthlyChangePercent.toFixed(2)}%
          </span>
        </span>
      </span>
    </>
  );
}

export default function CryptoTicker() {
  return (
    <div className="relative z-10 w-full overflow-hidden border-b border-white/[0.06] bg-[#050505]/40 backdrop-blur-sm">
      <div className="animate-ticker flex w-max items-center py-2.5">
        <TickerItems />
        <TickerItems />
      </div>
    </div>
  );
}
