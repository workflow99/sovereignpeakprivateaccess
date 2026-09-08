import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Camera, Clock, Lock, Moon, ShieldAlert, ShieldCheck, Sun, Trash2, User } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAppStore } from "../../store/AppStoreContext";
import Avatar from "../../components/dashboard/Avatar";
import ChangePasswordModal from "../../components/dashboard/ChangePasswordModal";
import KycModal from "../../components/dashboard/KycModal";
import { VERIFICATION_LABEL, VERIFICATION_STYLE } from "../../utils/verification";

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#B3B3B3]">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
      />
    </label>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[#B3B3B3]">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#D62839]" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

const VERIFICATION_ICON = { unverified: ShieldAlert, pending: Clock, verified: BadgeCheck };
const VERIFICATION_DESCRIPTION = {
  unverified: "Complete KYC verification to start using all account features.",
  pending: "Your information has been submitted. Please allow a few business days to process it.",
  verified: "Your account is fully verified.",
};

export default function SettingsPage() {
  const { state, updateProfile, deleteAccount } = useAppStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: state.profile.name,
    email: state.profile.email,
    phone: state.profile.phone,
  });
  const [saved, setSaved] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const fileInputRef = useRef(null);

  const theme = state.profile.theme ?? "dark";
  const isLight = theme === "light";
  const verificationStatus = state.profile.verificationStatus ?? "unverified";
  const VerificationIcon = VERIFICATION_ICON[verificationStatus];

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatarUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Permanently delete your account? This cannot be undone.")) {
      deleteAccount();
      // See DashboardSidebar's handleLogOut for why this is deferred.
      setTimeout(() => navigate("/", { replace: true }), 0);
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, security, and appearance preferences." />

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 sm:px-8 lg:grid-cols-2">
        <form onSubmit={handleSave} className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <User size={16} className="text-[#D62839]" />
            Profile
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Avatar name={state.profile.name} avatarUrl={state.profile.avatarUrl} size={64} className="text-xl" />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-full border border-[rgba(177,18,38,0.3)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/5"
              >
                <Camera size={13} />
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <p className="mt-1.5 text-[11px] text-[#6a6a6a]">JPG or PNG, shown across your dashboard.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <Field
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            {saved ? "Saved" : "Save Changes"}
          </button>
        </form>

        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <VerificationIcon size={16} className={VERIFICATION_STYLE[verificationStatus].color} />
                Account Verification
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${VERIFICATION_STYLE[verificationStatus].style} ${VERIFICATION_STYLE[verificationStatus].color}`}
              >
                {VERIFICATION_LABEL[verificationStatus]}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#B3B3B3]">{VERIFICATION_DESCRIPTION[verificationStatus]}</p>
            {verificationStatus === "unverified" && (
              <button
                type="button"
                onClick={() => setKycOpen(true)}
                className="mt-4 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                Start KYC Verification
              </button>
            )}
          </div>

          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck size={16} className="text-[#D62839]" />
              Security
            </div>
            <div className="mt-2 divide-y divide-white/5">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Lock size={14} className="text-[#B3B3B3]" />
                  Password
                </div>
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(true)}
                  className="text-xs font-medium text-[#D62839] hover:text-[#EF4444]"
                >
                  Change Password
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Trash2 size={14} className="text-[#B3B3B3]" />
                  Delete Account
                </div>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="text-xs font-medium text-red-400 hover:text-red-300"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              {isLight ? <Sun size={16} className="text-[#D62839]" /> : <Moon size={16} className="text-[#D62839]" />}
              Appearance
            </div>
            <div className="mt-2 divide-y divide-white/5">
              <Toggle
                checked={isLight}
                onChange={(v) => updateProfile({ theme: v ? "light" : "dark" })}
                label="Light Mode"
                description="Switch the dashboard between dark and light mode."
              />
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
      <KycModal open={kycOpen} onClose={() => setKycOpen(false)} />
    </>
  );
}
