import { ShieldAlert } from "lucide-react";
import Modal from "./Modal";

export default function KycReminderModal({ open, onClose, onStart }) {
  return (
    <Modal open={open} onClose={onClose} title="Verify Your Account">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(177,18,38,0.35)] bg-[rgba(177,18,38,0.1)]">
          <ShieldAlert size={20} className="text-[#EF4444]" />
        </span>
        <p className="mt-4 text-sm leading-relaxed text-[#B3B3B3]">
          To keep your account in good standing and unlock full platform features, please complete KYC
          (Know Your Customer) verification.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            Start KYC Verification
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-white/10 py-2.5 text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-white/5 hover:text-white"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </Modal>
  );
}
