import { Link } from "react-router-dom";
import { CoinIcon } from "../icons/CryptoIcons";
import useMarketCoins from "../../hooks/useMarketCoins";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const compactQty = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 6 });

export default function HoldingsTable({ holdings, totalValue, otherAssetsValue, onAddAsset }) {
  const { coins: marketCoins } = useMarketCoins();
  const otherPercent = totalValue ? (otherAssetsValue / totalValue) * 100 : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Your Holdings</span>
        <button
          type="button"
          onClick={onAddAsset}
          className="rounded-full border border-[rgba(177,18,38,0.3)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/5"
        >
          + Add Asset
        </button>
      </div>

      {/* Card list below lg — a 7-column table doesn't have room to breathe until then, so every
          holding's full stat set is shown stacked instead of forcing the box to scroll sideways. */}
      <div className="mt-4 divide-y divide-white/5 lg:hidden">
        {holdings.map((h) => {
          const gainPositive = h.totalGainLoss >= 0;
          const dayPositive = h.dayChangePercent >= 0;
          return (
            <div key={h.symbol} className="py-3.5">
              <div className="flex items-center gap-2.5">
                <CoinIcon symbol={h.symbol} size={26} coins={marketCoins} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{h.name}</p>
                  <p className="text-xs text-[#B3B3B3]">{h.symbol}</p>
                </div>
                <span className="ml-auto shrink-0 font-medium text-white">{currency(h.marketValue)}</span>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Quantity</span>
                  <span className="text-white">{compactQty(h.quantity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Price</span>
                  <span className="text-white">{currency(h.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Allocation</span>
                  <span className="text-white">{h.allocationPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Day Change</span>
                  <span className={dayPositive ? "text-emerald-400" : "text-red-400"}>
                    {dayPositive ? "+" : ""}
                    {h.dayChangePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="col-span-2 flex justify-between">
                  <span className="text-[#B3B3B3]">Total Gain/Loss</span>
                  <span className={gainPositive ? "text-emerald-400" : "text-red-400"}>
                    {gainPositive ? "+" : ""}
                    {currency(h.totalGainLoss)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[#B3B3B3]">
              +
            </span>
            <p className="font-medium text-white">Other Assets</p>
            <span className="ml-auto shrink-0 font-medium text-white">{currency(otherAssetsValue)}</span>
          </div>
          <div className="mt-2.5 flex justify-between text-xs">
            <span className="text-[#B3B3B3]">Allocation</span>
            <span className="text-white">{otherPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Table from lg up — fluid width, no min-width, so it never needs horizontal scroll. */}
      <div className="mt-4 hidden lg:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-[#B3B3B3]">
              <th className="pb-3 font-medium">Asset</th>
              <th className="pb-3 font-medium">Quantity</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Market Value</th>
              <th className="pb-3 font-medium">Allocation</th>
              <th className="pb-3 font-medium">Day Change</th>
              <th className="pb-3 text-right font-medium">Total Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const gainPositive = h.totalGainLoss >= 0;
              const dayPositive = h.dayChangePercent >= 0;
              return (
                <tr key={h.symbol} className="border-b border-white/5">
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <CoinIcon symbol={h.symbol} size={26} coins={marketCoins} />
                      <div>
                        <p className="font-medium text-white">{h.name}</p>
                        <p className="text-xs text-[#B3B3B3]">{h.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#B3B3B3]">{compactQty(h.quantity)}</td>
                  <td className="text-[#B3B3B3]">{currency(h.price)}</td>
                  <td className="font-medium text-white">{currency(h.marketValue)}</td>
                  <td className="text-[#B3B3B3]">{h.allocationPercent.toFixed(1)}%</td>
                  <td className={dayPositive ? "text-emerald-400" : "text-red-400"}>
                    {dayPositive ? "+" : ""}
                    {h.dayChangePercent.toFixed(2)}%
                  </td>
                  <td className={`text-right font-medium ${gainPositive ? "text-emerald-400" : "text-red-400"}`}>
                    {gainPositive ? "+" : ""}
                    {currency(h.totalGainLoss)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[#B3B3B3]">
                    +
                  </span>
                  <p className="font-medium text-white">Other Assets</p>
                </div>
              </td>
              <td className="text-[#B3B3B3]">&mdash;</td>
              <td className="text-[#B3B3B3]">&mdash;</td>
              <td className="font-medium text-white">{currency(otherAssetsValue)}</td>
              <td className="text-[#B3B3B3]">{otherPercent.toFixed(1)}%</td>
              <td className="text-[#B3B3B3]">&mdash;</td>
              <td className="text-right text-[#B3B3B3]">&mdash;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link
        to="/dashboard/transactions"
        className="mt-4 inline-block text-xs font-medium text-[#D62839] transition-colors hover:text-[#EF4444]"
      >
        View All Holdings
      </Link>
    </div>
  );
}
