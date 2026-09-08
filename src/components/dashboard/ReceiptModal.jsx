import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { downloadReceiptPdf, receiptNumber } from "../../utils/receiptPdf";

const currency = (n) =>
  Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const TYPE_LABEL = {
  deposit: "Deposit",
  buy: "Buy",
  transfer: "Transfer",
  rebalance: "Rebalance",
  withdrawal: "Withdrawal",
};

const STATUS_STYLE = {
  completed: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
  pending: "border-amber-500/30 bg-amber-50 text-amber-700",
  failed: "border-red-500/30 bg-red-50 text-red-700",
};

function Row({ label, value }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-black/5 py-2.5 text-sm last:border-b-0">
      <span className="shrink-0 text-[#6b6b6b]">{label}</span>
      <span className="break-words text-right font-medium text-[#171717]">{value}</span>
    </div>
  );
}

export default function ReceiptModal({ transaction, profile, onClose }) {
  const open = !!transaction;
  const positive = transaction ? transaction.amount > 0 : false;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close receipt"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-[#0a0a0c] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="text-sm font-medium text-white">Transaction Receipt</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              {transaction && (
                <div className="rounded-xl bg-white p-5 text-[#171717] shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:p-6">
                  <div className="border-b-2 border-[#B11226]/20 pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                      <div className="min-w-0">
                        <p className="break-words font-serif text-xl font-bold tracking-tight text-[#171717]">
                          PROJECT <span className="text-[#B11226]">SOVEREIGN PEAK</span>
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-[#8a8a8a]">
                          Institutional Retirement &amp; Digital Asset Platform
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#B11226]">Official Receipt</p>
                        <p className="mt-0.5 font-mono text-[11px] text-[#8a8a8a]">{receiptNumber(transaction.id)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-start justify-between gap-x-3 gap-y-3 border-t border-dashed border-black/10 pt-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-[#8a8a8a]">Billed To</p>
                      <p className="mt-1 break-words text-sm font-medium text-[#171717]">{profile?.name || "Investor"}</p>
                      <p className="break-words text-xs text-[#8a8a8a]">{profile?.email || "—"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] uppercase tracking-wide text-[#8a8a8a]">Date</p>
                      <p className="mt-1 text-sm font-medium text-[#171717]">{transaction.date}</p>
                      <span
                        className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          STATUS_STYLE[transaction.status] ?? "border-black/10 bg-black/[0.03] text-[#6b6b6b]"
                        }`}
                      >
                        {transaction.status ?? "completed"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-[#fafafa] px-3.5">
                    <Row label="Description" value={transaction.label || TYPE_LABEL[transaction.type] || transaction.type} />
                    <Row label="Type" value={TYPE_LABEL[transaction.type] ?? transaction.type} />
                    {transaction.symbol && <Row label="Asset" value={transaction.symbol} />}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4">
                    <span className="text-sm font-semibold text-[#171717]">Total Amount</span>
                    <span className={`text-xl font-bold ${positive ? "text-emerald-600" : "text-[#171717]"}`}>
                      {positive ? "+" : ""}
                      {currency(transaction.amount)}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-black/10 pt-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#171717]">
                      Sovereign Peak Capital LLC
                    </p>
                    <p className="mt-1 text-[10px] text-[#a0a0a0]">
                      This is an official transaction record. Please retain for your records.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => transaction && downloadReceiptPdf(transaction, profile)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                <Download size={15} />
                Download Receipt
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
