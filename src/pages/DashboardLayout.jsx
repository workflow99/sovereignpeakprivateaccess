import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import TopBar from "../components/dashboard/TopBar";
import KycReminderModal from "../components/dashboard/KycReminderModal";
import KycModal from "../components/dashboard/KycModal";
import DepositAddressModal from "../components/dashboard/DepositAddressModal";
import { useAppStore } from "../store/AppStoreContext";

// How long after landing on the dashboard the KYC reminder first appears,
// if the investor still hasn't submitted their KYC info.
const KYC_REMINDER_DELAY_MS = 20000;

export default function DashboardLayout() {
  const { state } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1024
  );
  const [kycReminderOpen, setKycReminderOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const lastPromptSeenRef = useRef(state.profile.kycPromptRequestedAt ?? null);
  const kycModalOpenRef = useRef(false);

  const verificationStatus = state.profile.verificationStatus ?? "unverified";

  // Both reminder triggers below fire on delayed timers/async storage events,
  // so they need the *current* modal-open state, not what it was when the
  // effect was set up — otherwise the reminder can pop on top of the wizard
  // the investor is actively filling out and block its buttons.
  useEffect(() => {
    kycModalOpenRef.current = kycModalOpen;
  }, [kycModalOpen]);

  // Theme is scoped to the dashboard only — the landing page and admin
  // panel always stay dark, so the attribute is set here and cleared on
  // unmount rather than living globally for the whole app.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.profile.theme ?? "dark");
    return () => document.documentElement.removeAttribute("data-theme");
  }, [state.profile.theme]);

  // Auto-reminder: fires once per dashboard visit (and again on the next
  // visit/reload) as long as the account is still unverified — this is
  // what makes it "keep popping up" until KYC is actually submitted.
  useEffect(() => {
    if (verificationStatus !== "unverified") return;
    const timer = setTimeout(() => {
      if (kycModalOpenRef.current) return;
      setKycReminderOpen(true);
    }, KYC_REMINDER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [verificationStatus]);

  // Admin-triggered reminder: the Superadmin panel can nudge a specific
  // investor at any time — this syncs live across tabs the same way the
  // rest of the store does, so it can fire immediately even mid-session.
  useEffect(() => {
    const requestedAt = state.profile.kycPromptRequestedAt;
    if (requestedAt && requestedAt !== lastPromptSeenRef.current) {
      lastPromptSeenRef.current = requestedAt;
      if (!kycModalOpenRef.current) setKycReminderOpen(true);
    }
  }, [state.profile.kycPromptRequestedAt]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onDeposit={() => setDepositOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="flex-1 pb-20">
          <Outlet />
        </div>
      </div>

      <KycReminderModal
        open={kycReminderOpen}
        onClose={() => setKycReminderOpen(false)}
        onStart={() => {
          setKycReminderOpen(false);
          setKycModalOpen(true);
        }}
      />
      <KycModal open={kycModalOpen} onClose={() => setKycModalOpen(false)} />
      <DepositAddressModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        address={state.profile.depositAddress}
      />
    </div>
  );
}
