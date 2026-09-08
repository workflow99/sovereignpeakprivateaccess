import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Program", href: "#program" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Security", href: "#security" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(177,18,38,0.14)]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#B3B3B3]">
              Institutional-grade retirement and digital asset management for modern investors.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:max-w-[260px]">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                Investor Login
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#B11226] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#d62839]"
              >
                Private Access
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:justify-self-end">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-[#B3B3B3] transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row sm:px-8">
          <p className="text-xs text-[#6b6b6b]">
            &copy; {new Date().getFullYear()} Sovereign Peak Capital LLC. All rights reserved.
          </p>
          <p className="text-center text-xs text-[#6b6b6b] sm:text-right">
            Sovereign Peak Capital LLC is a registered investment adviser.
          </p>
        </div>
      </div>
    </footer>
  );
}
