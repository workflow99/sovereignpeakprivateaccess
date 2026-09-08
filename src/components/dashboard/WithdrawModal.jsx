import { useState } from "react";
import Modal from "./Modal";
import useMarketCoins from "../../hooks/useMarketCoins";

export default function WithdrawModal({ open, onClose }) {
  const { coins } = useMarketCoins();
  const [symbol, setSymbol] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setAmount("");
    setAddress("");
    setError("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("Withdrawal period not elapsed.");
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]";

  return (
    <Modal open={open} onClose={handleClose} title="Withdraw Crypto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-xs text-red-300">
            {error}
          </p>
        )}

      

        <div>
          <label className="text-xs font-medium text-[#B3B3B3]">Asset</label>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className={inputClass}>
            {coins.map((c) => (
              <option key={c.symbol} value={c.symbol} className="bg-[#0a0a0c]">
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-[#B3B3B3]">Amount</label>
          <input
            type="number"
            min="0"
            step="0.0001"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#B3B3B3]">Destination Wallet Address</label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. bc1... / 0x..."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          Withdraw
        </button>
      </form>
    </Modal>
  );
}
