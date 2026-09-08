import { useState } from "react";
import { Check, Copy } from "lucide-react";
import Modal from "./Modal";

export default function DepositAddressModal({ open, onClose, address }) {
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the address is still visible to copy by hand.
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Deposit USD">
      {address ? (
        <div className="space-y-4">
          <p className="text-xs leading-relaxed text-[#B3B3B3]">
            Send USD (or a USD-pegged stablecoin) to the address below. Funds are credited to your
            buying power once your administrator confirms the deposit.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
            <span className="break-all font-mono text-xs text-white">{address}</span>
            <button
              type="button"
              onClick={handleCopy}
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
      )}
    </Modal>
  );
}
