import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import MagneticButton from "./MagneticButton";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Program", href: "#program" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Security", href: "#security" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-500 ${scrolled ? "px-4" : "px-0"}`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl border px-5 transition-all duration-500 sm:px-8 ${
            scrolled
              ? "border-[rgba(177,18,38,0.18)] bg-[rgba(8,8,8,0.72)] py-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "border-transparent bg-transparent py-2"
          }`}
        >
          <a href="#home" className="shrink-0">
            <Logo />
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-wide text-[#B3B3B3] transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className="text-sm font-medium tracking-wide text-white/90 transition-colors hover:text-white"
            >
              Investor Login
            </Link>
            <MagneticButton
              as={Link}
              to="/signup"
              className="rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(177,18,38,0.35)] transition-shadow duration-300 hover:shadow-[0_0_28px_rgba(239,68,68,0.55)]"
            >
              Private Access
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(177,18,38,0.25)] text-white lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-4 mt-3 overflow-hidden rounded-2xl border border-[rgba(177,18,38,0.18)] bg-[rgba(8,8,8,0.96)] p-6 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-[#B3B3B3] transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-[rgba(177,18,38,0.18)] pt-4">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[rgba(177,18,38,0.3)] px-5 py-3 text-center text-sm font-medium text-white"
              >
                Investor Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(177,18,38,0.35)]"
              >
                Private Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
