import { useState } from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { Lock, ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "../store/AppStoreContext";
import { useToast } from "./ToastProvider";

const ADMIN_AUTH_KEY = "sp_admin_auth";
const DEFAULT_ADMIN_PASSWORD = "shmatheo1223";

function isAdminAuthed() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1";
}

function setAdminAuthed() {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
  }
}

export default function AdminGuard() {
  const { state } = useAppStore();
  const { addToast } = useToast();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authed, setAuthed] = useState(isAdminAuthed);
  const [checking, setChecking] = useState(false);

  if (authed) {
    return <Outlet />;
  }

  if (state.session.userId && !authed) {
    // Allow the admin password gate to appear even for a session-aware user.
    // The public login page is intentionally not used for admin entry.
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setChecking(true);
    const trimmed = password.trim();
    const expected = state.adminPassword ?? DEFAULT_ADMIN_PASSWORD;
    setTimeout(() => {
      if (trimmed === expected) {
        setAdminAuthed();
        setAuthed(true);
      } else {
        addToast("Incorrect admin password.", "error");
        setPassword("");
      }
      setChecking(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="glass-panel w-full max-w-md rounded-[28px] p-8 sm:p-10">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B11226]/10">
            <Shield className="text-[#D62839]" size={28} />
          </div>
        </div>
        <h1 className="text-center font-serif text-2xl text-white">Admin Access</h1>
        <p className="mt-2 text-center text-sm text-[#B3B3B3]">
          Enter the admin password to continue.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3B3B3]"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-11 text-sm text-white outline-none transition-colors placeholder:text-[#666] focus:border-[#D62839]/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B3B3B3] transition-colors hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={checking || !password.trim()}
            className="w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-3 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-60"
          >
            {checking ? "Verifying…" : "Continue"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[#B3B3B3] transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
