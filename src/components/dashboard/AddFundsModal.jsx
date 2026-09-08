import { useState } from "react";
import Modal from "./Modal";
import { useAppStore } from "../../store/AppStoreContext";

const METHODS = ["Bank Transfer", "Debit Card", "Wire Transfer"];

export default function AddFundsModal({ open, onClose }) {
  const { addFunds } = useAppStore();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    addFunds(value, method);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setAmount("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Funds">
      {submitted ? (
        <div className="text-center">
          <p className="text-sm text-[#B3B3B3]">
            ${Number(amount).toLocaleString()} was added to your buying power.
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#B3B3B3]">Amount (USD)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#B3B3B3]">Funding Method</label>
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
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            Add Funds
          </button>
        </form>
      )}
    </Modal>
  );
}
