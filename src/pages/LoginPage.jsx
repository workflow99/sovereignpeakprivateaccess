import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Lock, Mail, Rocket, User } from "lucide-react";
import Logo from "../components/Logo";
import RocketGlyph from "../components/RocketGlyph";
import { useAppStore } from "../store/AppStoreContext";

const STARS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  top: Math.round((i * 37) % 100),
  left: Math.round((i * 53) % 100),
  size: 1 + (i % 3),
  delay: (i % 6) * 0.3,
}));

function DecorativePanel({ mode, onSwitch }) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1a0507] via-[#0d0203] to-[#050505] p-8 sm:p-10">
      <div className="pointer-events-none absolute inset-0">
        {STARS.map((s) => (
          <motion.span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.15, 0.9, 0.15] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(177,18,38,0.35), transparent 70%)",
          }}
        />
      </div>

      <Link to="/" className="relative z-10 w-fit">
        <Logo />
      </Link>

      <div className="relative z-10 flex flex-col items-center py-10 text-center">
        <div className="relative flex h-32 items-end justify-center">
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <RocketGlyph width={54} height={92} />
            <motion.span
              animate={{ scaleY: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-[86px] h-10 w-4 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#EF4444] via-[#D62839]/70 to-transparent blur-[3px]"
              style={{ transformOrigin: "top" }}
            />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-serif text-2xl text-white sm:text-3xl">
              {mode === "login" ? "Welcome Back" : "Join Project Sovereign Peak"}
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#B3B3B3]">
              {mode === "login"
                ? "Log in to track your private retirement portfolio and holdings."
                : "Create your invitation-only account with your private access key."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="relative z-10 flex items-center justify-center gap-2 rounded-full border border-[rgba(177,18,38,0.35)] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]"
      >
        <Rocket size={15} className="text-[#EF4444]" />
        {mode === "login" ? "New here? Create an Account" : "Already a member? Log In"}
      </button>
    </div>
  );
}

function FormField({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6a6a6a]" />
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#6a6a6a] focus:border-[rgba(177,18,38,0.5)]"
      />
    </div>
  );
}

function PasswordField({ value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6a6a6a]" />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-colors placeholder:text-[#6a6a6a] focus:border-[rgba(177,18,38,0.5)]"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a6a6a] hover:text-white"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-xs text-red-300"
    >
      {message}
    </motion.p>
  );
}

function LoginForm({ onSubmitted }) {
  const { logIn } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await logIn({ email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl text-white">Investor Login</h1>
      <ErrorBanner message={error} />
      <FormField
        icon={Mail}
        type="email"
        required
        placeholder="Email address"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-3 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-60"
      >
        {loading ? "Logging In…" : "Log In"}
      </button>
    </form>
  );
}

function SignupForm({ onSubmitted, onSwitchToLogin }) {
  const { signUp } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const result = await signUp({ firstName, lastName, email, password, accessKey });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl text-white">Create Your Account</h1>
      <ErrorBanner message={error} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          icon={User}
          type="text"
          required
          placeholder="First name"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <FormField
          icon={User}
          type="text"
          required
          placeholder="Surname"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <FormField
        icon={Mail}
        type="email"
        required
        placeholder="Email address"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
        />
        <PasswordField
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm"
          autoComplete="new-password"
        />
      </div>
      <FormField
        icon={KeyRound}
        type="text"
        required
        placeholder="Private access key"
        value={accessKey}
        onChange={(e) => setAccessKey(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-3 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-60"
      >
        {loading ? "Creating Account…" : "Create Account"}
      </button>
      <p className="text-center text-xs text-[#B3B3B3] sm:hidden">
        Already a member?{" "}
        <button type="button" onClick={onSwitchToLogin} className="font-semibold text-[#EF4444]">
          Log In
        </button>
      </p>
    </form>
  );
}

export default function LoginPage() {
  const location = useLocation();
  const isSignupRoute = location.pathname === "/signup";
  const [mode, setMode] = useState(isSignupRoute ? "signup" : "login");
  const navigate = useNavigate();

  const handleSubmitted = () => navigate("/dashboard");

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050505] px-4 py-10">
      <div className="glass-panel grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[28px] sm:grid-cols-2">
        <DecorativePanel mode={mode} onSwitch={() => setMode((m) => (m === "login" ? "signup" : "login"))} />

        <div className="flex flex-col justify-center p-8 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {mode === "login" ? (
                <>
                  <LoginForm onSubmitted={handleSubmitted} />
                  <p className="mt-5 text-center text-xs text-[#B3B3B3] sm:hidden">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="font-semibold text-[#EF4444]">
                      Sign Up
                    </button>
                  </p>
                </>
              ) : (
                <SignupForm onSubmitted={handleSubmitted} onSwitchToLogin={() => setMode("login")} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
