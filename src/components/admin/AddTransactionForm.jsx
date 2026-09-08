import { useState } from "react";
import { Plus } from "lucide-react";
import useMarketCoins from "../../hooks/useMarketCoins";

const USD_TYPES = ["deposit", "withdrawal"];
const STATUS_OPTIONS = ["completed", "pending", "failed"];
const today = () => new Date().toISOString().slice(0, 10);

export default function AddTransactionForm({ onAdd }) {
  const { coins } = useMarketCoins();
  const [kind, setKind] = useState("usd");
  const [label, setLabel] = useState("");
  const [type, setType] = useState("deposit");
  const [cryptoType, setCryptoType] = useState("buy");
  const [amount, setAmount] = useState("");
  const [symbol, setSymbol] = useState("BTC");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("completed");
  const [date, setDate] = useState(today());

  const coin = coins.find((c) => c.symbol === symbol) ?? coins[0];
  const price = coin?.current_price ?? 0;
  const spend = (Number(quantity) || 0) * price;

  const reset = () => {
    setLabel("");
    setAmount("");
    setQuantity("");
    setCryptoType("buy");
    setStatus("completed");
    setDate(today());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (kind === "crypto") {
      if (!coin || !(Number(quantity) > 0)) return;
      onAdd({
        kind: "crypto",
        type: cryptoType,
        label,
        status,
        date,
        symbol: coin.symbol,
        name: coin.name,
        quantity: Number(quantity),
        price,
      });
    } else {
      onAdd({ kind: "usd", type, label, amount: Number(amount) || 0, status, date });
    }
    reset();
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-5 flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4"
    >
      <div className="flex gap-1 rounded-full border border-white/10 p-1 self-start">
        {[
          { key: "usd", label: "USD" },
          { key: "crypto", label: "Crypto Coin" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setKind(opt.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              kind === opt.key ? "bg-[#D62839] text-white" : "text-[#B3B3B3] hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[160px] flex-1">
          <span className="text-xs font-medium text-[#B3B3B3]">Description</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={
              kind === "crypto"
                ? `${cryptoType === "buy" ? "Buy" : "Deposit"} ${symbol}`
                : "e.g. Deposit via Bank Transfer"
            }
            className={inputClass}
          />
        </label>

        {kind === "crypto" && (
          <label className="min-w-[130px] flex-1">
            <span className="text-xs font-medium text-[#B3B3B3]">Crypto Type</span>
            <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} className={inputClass}>
              <option value="buy" className="bg-[#0a0a0c]">
                Buy (spends cash)
              </option>
              <option value="deposit" className="bg-[#0a0a0c]">
                Deposit (no cash change)
              </option>
            </select>
          </label>
        )}

        {kind === "usd" ? (
          <>
            <label className="min-w-[140px] flex-1">
              <span className="text-xs font-medium text-[#B3B3B3]">Type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                {USD_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#0a0a0c]">
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-[140px] flex-1">
              <span className="text-xs font-medium text-[#B3B3B3]">Amount (USD)</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClass}
              />
            </label>
          </>
        ) : (
          <>
            <label className="min-w-[160px] flex-1">
              <span className="text-xs font-medium text-[#B3B3B3]">Coin</span>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className={inputClass}>
                {coins.map((c) => (
                  <option key={c.symbol} value={c.symbol} className="bg-[#0a0a0c]">
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-[120px] flex-1">
              <span className="text-xs font-medium text-[#B3B3B3]">Quantity</span>
              <input
                type="number"
                step="0.0001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputClass}
              />
            </label>
            <div className="min-w-[140px] flex-1">
              <span className="text-xs font-medium text-[#B3B3B3]">
                {cryptoType === "buy" ? "Est. Cost" : "Est. Value"}
              </span>
              <div className="mt-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2 text-sm text-white">
                ${spend.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </>
        )}

        <label className="min-w-[130px] flex-1">
          <span className="text-xs font-medium text-[#B3B3B3]">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#0a0a0c]">
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-[140px] flex-1">
          <span className="text-xs font-medium text-[#B3B3B3]">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </label>

        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-4 py-2 text-xs font-semibold text-white"
        >
          <Plus size={13} />
          Add
        </button>
      </div>
    </form>
  );
}
