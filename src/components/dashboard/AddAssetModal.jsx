import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import Modal from "./Modal";
import { useAppStore } from "../../store/AppStoreContext";
import useMarketCoins from "../../hooks/useMarketCoins";
import { colorForSymbol } from "../../utils/coinColor";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function AddAssetModal({ open, onClose }) {
  const { state, addAsset, depositAsset } = useAppStore();
  const { coins, status } = useMarketCoins();
  const [mode, setMode] = useState("buy");
  const [symbol, setSymbol] = useState("BTC");
  const [quantity, setQuantity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (coins.length && !coins.some((c) => c.symbol === symbol)) {
      setSymbol(coins[0].symbol);
    }
  }, [coins, symbol]);

  const asset = coins.find((c) => c.symbol === symbol);
  const price = asset?.current_price ?? 0;
  const qtyNumber = Number(quantity) || 0;
  const value = qtyNumber * price;
  const insufficientFunds = mode === "buy" && value > state.balances.cash;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qtyNumber || qtyNumber <= 0 || !price || !asset || insufficientFunds) return;
    const payload = {
      symbol,
      name: asset.name,
      quantity: qtyNumber,
      avgCost: price,
      color: colorForSymbol(symbol),
      spend: value,
    };
    if (mode === "buy") {
      addAsset(payload);
    } else {
      depositAsset(payload);
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setQuantity("");
    setMode("buy");
    setCopied(false);
    onClose();
  };

  const handleCopy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the address is still visible to copy by hand.
    }
  };

  const cryptoAddress = state.profile.cryptoDepositAddress;

  return (
    <Modal open={open} onClose={handleClose} title={mode === "buy" ? "Add Asset" : "Deposit Crypto"}>
      {submitted ? (
        <div className="text-center">
          <p className="text-sm text-[#B3B3B3]">
            {qtyNumber} {symbol} {mode === "buy" ? "purchased for" : "deposited to"} your portfolio
            {mode === "buy" ? ` at $${price.toLocaleString()} each.` : "."}
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-1 rounded-full border border-white/10 p-1">
            {[
              { key: "buy", label: "Buy with Buying Power" },
              { key: "deposit", label: "Deposit Crypto" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setMode(opt.key)}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === opt.key ? "bg-[#D62839] text-white" : "text-[#B3B3B3] hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {mode === "deposit" ? (
            cryptoAddress ? (
              <div className="space-y-4">
                <p className="text-xs leading-relaxed text-[#B3B3B3]">
                  Send crypto to the address below. Funds are credited to your portfolio once your
                  administrator confirms the deposit.
                </p>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
                  <span className="break-all font-mono text-xs text-white">{cryptoAddress}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(cryptoAddress)}
                    aria-label="Copy deposit address"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                {copied && <p className="text-xs text-emerald-400">Address copied to clipboard.</p>}
              </div>
            ) : (
              <p className="text-sm text-[#B3B3B3]">
                Your deposit address hasn&apos;t been set up yet. Contact your administrator.
              </p>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#B3B3B3]">Asset</label>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
                >
                  {coins.map((c) => (
                    <option key={c.symbol} value={c.symbol} className="bg-[#0a0a0c]">
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
                {status === "loading" && (
                  <p className="mt-1.5 text-[11px] text-[#B3B3B3]">Loading full market list…</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-[#B3B3B3]">Quantity</label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-sm">
                <span className="text-[#B3B3B3]">Live Price</span>
                <span className="text-white">${price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-sm">
                <span className="text-[#B3B3B3]">Estimated Cost</span>
                <span className="font-medium text-white">
                  ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-sm">
                <span className="text-[#B3B3B3]">Buying Power Available</span>
                <span className="font-medium text-white">{currency(state.balances.cash)}</span>
              </div>
              {insufficientFunds && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-xs text-red-300">
                  Insufficient buying power for this purchase.
                </p>
              )}

              <button
                type="submit"
                disabled={insufficientFunds}
                className="w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50"
              >
                Buy Asset
              </button>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
