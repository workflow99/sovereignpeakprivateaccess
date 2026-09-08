import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Link2, Wifi } from "lucide-react";
import { shortAccountType } from "../../utils/accountType";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function LinkedAccountsBadge({ linkedAccounts }) {
  const [hidden, setHidden] = useState(false);
  const count = linkedAccounts.length;
  const latest = linkedAccounts[0];
  const totalBalance = linkedAccounts.reduce((sum, a) => sum + (a.balance ?? 0), 0);
  const allSameType = count > 0 && linkedAccounts.every((a) => a.provider === latest.provider);

  const headerLabel =
    count === 0
      ? "Linked Accounts"
      : allSameType
        ? `${shortAccountType(latest.provider)} Linked Account${count > 1 ? "s" : ""}`
        : "Linked Accounts";

  const subLabel =
    count === 0
      ? ""
      : count === 1
        ? latest.username
        : allSameType
          ? `${count} Accounts Connected`
          : `${count} Connected · ${shortAccountType(latest.provider)}`;

  return (
    <Link
      to="/dashboard/link"
      className="relative flex w-full shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-[rgba(177,18,38,0.2)] p-6 transition-colors hover:border-[rgba(177,18,38,0.4)] sm:w-72"
    >
      <div className="absolute inset-0 bg-[#0a0a0c]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 100% 0%, rgba(177,18,38,0.25), transparent 60%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase leading-snug tracking-[0.1em] text-[#B3B3B3]">
          {headerLabel}
        </span>
        <span
          className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
            count > 0 ? "bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" : "bg-[#5a5a5a]"
          }`}
        />
      </div>

      <div className="relative mt-4 flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
            count > 0
              ? "border-[rgba(177,18,38,0.3)] bg-[rgba(177,18,38,0.1)]"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          {count > 0 ? (
            <Wifi size={18} className="text-[#D62839]" />
          ) : (
            <Link2 size={18} className="text-[#B3B3B3]" />
          )}
        </span>

        <div className="min-w-0">
          {count > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <p className="font-serif text-xl text-white">{hidden ? "••••••" : currency(totalBalance)}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setHidden((v) => !v);
                  }}
                  aria-label={hidden ? "Show linked account balance" : "Hide linked account balance"}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#B3B3B3] transition-colors hover:text-white"
                >
                  {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <p className="truncate text-xs text-[#B3B3B3]">{subLabel}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-white">No accounts yet</p>
              <p className="text-xs text-[#B3B3B3]">Tap to link one</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
