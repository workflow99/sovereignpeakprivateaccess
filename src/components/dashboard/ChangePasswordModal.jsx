import { useState } from "react";
import Modal from "./Modal";
import { useAppStore } from "../../store/AppStoreContext";

export default function ChangePasswordModal({ open, onClose }) {
  const { changePassword } = useAppStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    const result = await changePassword(currentPassword, newPassword);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Change Password">
      {submitted ? (
        <div className="text-center">
          <p className="text-sm text-[#B3B3B3]">Your password was updated.</p>
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
          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-xs text-red-300">
              {error}
            </p>
          )}
          <div>
            <label className="text-xs font-medium text-[#B3B3B3]">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#B3B3B3]">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#B3B3B3]">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            Update Password
          </button>
        </form>
      )}
    </Modal>
  );
}
