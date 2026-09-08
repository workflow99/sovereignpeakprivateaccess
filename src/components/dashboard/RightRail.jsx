import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, RefreshCw } from "lucide-react";
import useMarketCoins from "../../hooks/useMarketCoins";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const ACTIVITY_ICON = {
  deposit: ArrowDownLeft,
  buy: ArrowUpRight,
  transfer: ArrowLeftRight,
  rebalance: RefreshCw,
};

function AccountSummaryCarousel({ items }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 2600);
    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[index];

  return (
    <div className="mt-3">
      <div className="relative h-14 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.label}
            initial={{ x: 26, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -26, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <span className="text-xs text-[#B3B3B3]">{current.label}</span>
            <span className={`mt-1 font-serif text-2xl ${current.className ?? "text-white"}`}>
              {current.display}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2 flex gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-label={`Show ${it.label}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-5 bg-[#D62839]" : "w-1.5 bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function RightRail({ totalValue, buyingPower, holdings, transactions }) {
  const totalGains = holdings.reduce((sum, h) => sum + h.totalGainLoss, 0);
  const recentActivity = transactions.slice(0, 4);
  const { coins: marketCoins } = useMarketCoins();
  // Loop the row so the scroll never visibly resets — see MarketsModal for
  // the same trick.
  const loopedCoins = [...marketCoins, ...marketCoins];

  const summaryItems = [
    { label: "Total Portfolio Value", display: currency(totalValue) },
    {
      label: "Total Gains",
      display: `${totalGains >= 0 ? "+" : ""}${currency(totalGains)}`,
      className: totalGains >= 0 ? "text-emerald-400" : "text-red-400",
    },
    { label: "Buying Power", display: currency(buyingPower) },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-panel rounded-2xl p-5">
        <span className="text-sm font-medium text-white">Account Summary</span>
        <AccountSummaryCarousel items={summaryItems} />
        <Link
          to="/dashboard/portfolio"
          className="mt-4 block w-full rounded-full border border-[rgba(177,18,38,0.3)] py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-white/5"
        >
          View Full Report
        </Link>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Recent Activity</span>
          <Link to="/dashboard/transactions" className="text-xs font-medium text-[#D62839] hover:text-[#EF4444]">
            View All
          </Link>
        </div>
        <div className="mt-3 space-y-3.5">
          {recentActivity.length === 0 && (
            <p className="text-sm text-[#B3B3B3]">No activity yet.</p>
          )}
          {recentActivity.map((a) => {
            const Icon = ACTIVITY_ICON[a.type] ?? RefreshCw;
            const positive = a.amount > 0;
            const neutral = a.amount === 0;
            return (
              <div key={a.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    <Icon size={14} className="text-[#B3B3B3]" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{a.label}</p>
                    <p className="text-[11px] text-[#B3B3B3]">{a.date}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${
                    neutral ? "text-[#B3B3B3]" : positive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {positive ? "+" : ""}
                  {currency(a.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl p-5">
        <span className="text-sm font-medium text-white">Market Snapshot</span>
        <div className="relative mt-3 -mx-5 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#0d0d0f] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#0d0d0f] to-transparent" />
          <motion.div
            className="flex w-max gap-3 px-5"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: marketCoins.length * 18, repeat: Infinity, ease: "linear" }}
          >
            {loopedCoins.map((c, i) => {
              const positive = (c.price_change_percentage_24h ?? 0) >= 0;
              return (
                <div
                  key={`${c.symbol}-${i}`}
                  className="flex w-[128px] shrink-0 flex-col items-start gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-3.5"
                >
                  {c.image ? (
                    <img src={c.image} alt="" className="h-[22px] w-[22px] rounded-full" />
                  ) : (
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white">
                      {c.symbol.slice(0, 1)}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-[11px] text-[#B3B3B3]">{c.symbol}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{currency(c.current_price ?? 0)}</p>
                    <p className={`text-[11px] ${positive ? "text-emerald-400" : "text-red-400"}`}>
                      {positive ? "+" : ""}
                      {(c.price_change_percentage_24h ?? 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
