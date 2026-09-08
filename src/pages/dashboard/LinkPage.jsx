import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Clock, Eye, EyeOff, Link2, ShieldCheck, Trash2, Wifi } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import RocketLoader from "../../components/RocketLoader";
import { useAppStore } from "../../store/AppStoreContext";
import { PROVIDER_TYPES } from "../../utils/accountType";

function LinkIllustration() {
  return (
    <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[rgba(177,18,38,0.2)] bg-[#0a0a0c] p-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(177,18,38,0.28), transparent 65%)",
        }}
      />
      <div className="grid-bg absolute inset-0 opacity-20" />

      <div className="relative flex items-center gap-8">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <Building2 size={26} className="text-[#B3B3B3]" />
        </motion.div>

        <svg width="72" height="24" viewBox="0 0 72 24" fill="none" className="shrink-0">
          <motion.path
            d="M2 12H70"
            stroke="#D62839"
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.circle
            cx="36"
            cy="12"
            r="4"
            fill="#EF4444"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(177,18,38,0.35)] bg-[rgba(177,18,38,0.1)]"
        >
          <Link2 size={26} className="text-[#D62839]" />
        </motion.div>
      </div>

      <p className="relative mt-8 max-w-[220px] text-center text-xs leading-relaxed text-[#B3B3B3]">
        Securely connect an external account provider to sync balances automatically.
      </p>
    </div>
  );
}

const RETIREMENT_TYPE = "Retirement Account (401k / IRA)";

const STATUS_STYLE = {
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  connected: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  disconnected: "border-white/15 bg-white/[0.04] text-[#B3B3B3]",
};

export default function LinkPage() {
  const { state, linkAccount, removeLinkedAccount } = useAppStore();
  const [provider, setProvider] = useState("");
  const [retirementProvider, setRetirementProvider] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const isRetirement = provider === RETIREMENT_TYPE;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!provider.trim() || !username.trim() || !email.trim() || !password) return;
    if (isRetirement && !retirementProvider.trim()) return;
    setConnecting(true);
    setTimeout(() => {
      linkAccount({
        provider: provider.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        retirementProvider: isRetirement ? retirementProvider.trim() : "",
      });
      setProvider("");
      setRetirementProvider("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConnecting(false);
      setConnected(true);
      setTimeout(() => setConnected(false), 2500);
    }, 1200);
  };

  return (
    <>
      <RocketLoader visible={connecting} label="Linking" />

      <PageHeader
        title="Link Account"
        description="Connect an external account provider to this dashboard."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 sm:px-8 lg:grid-cols-2">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-5 sm:p-6"
        >
          <label className="block">
            <span className="text-xs font-medium text-[#B3B3B3]">Account Type</span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            >
              <option value="" disabled className="bg-[#0a0a0c]">
                Select an account type
              </option>
              {PROVIDER_TYPES.map((p) => (
                <option key={p} value={p} className="bg-[#0a0a0c]">
                  {p}
                </option>
              ))}
            </select>
          </label>

          {isRetirement && (
            <label className="mt-4 block">
              <span className="text-xs font-medium text-[#B3B3B3]">401(k) Provider</span>
              <input
                value={retirementProvider}
                onChange={(e) => setRetirementProvider(e.target.value)}
                placeholder="e.g. Fidelity, Vanguard, Charles Schwab"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
              />
            </label>
          )}

          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Password</span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 pr-10 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#B3B3B3] hover:text-white"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={connecting}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {connected ? "Account Linked" : "Link Account"}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <LinkIllustration />
        </motion.div>
      </div>

      <div className="mt-6 px-6 sm:px-8">
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Wifi size={15} className="text-[#D62839]" />
            Linked Accounts
          </div>
          <div className="mt-3 space-y-2">
            {state.linkedAccounts.length === 0 && (
              <p className="text-sm text-[#B3B3B3]">No accounts linked yet.</p>
            )}
            {state.linkedAccounts.map((a) => (
              <div key={a.id} className="rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {a.provider}
                      {a.retirementProvider && <span className="text-[#B3B3B3]"> &middot; {a.retirementProvider}</span>}
                    </p>
                    <p className="text-xs text-[#B3B3B3]">{a.username} &middot; linked {a.date}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-white">
                      {(a.balance ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${
                        STATUS_STYLE[a.status] ?? STATUS_STYLE.disconnected
                      }`}
                    >
                      {a.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLinkedAccount(a.id)}
                      aria-label="Remove linked account"
                      className="text-[#B3B3B3] hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {a.status === "pending" && (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400">
                    <Clock size={12} />
                    You&apos;ll be notified once your account has been connected.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
