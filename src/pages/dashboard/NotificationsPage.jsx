import { useState } from "react";
import { Bell, CheckCheck, CreditCard, Gift, HandCoins, LifeBuoy, Receipt, RotateCcw } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import ReceiptModal from "../../components/dashboard/ReceiptModal";
import { useAppStore } from "../../store/AppStoreContext";

const TYPE_ICON = {
  transaction: CreditCard,
  loan: HandCoins,
  grant: Gift,
  support: LifeBuoy,
  refund: RotateCcw,
  system: Bell,
};

export default function NotificationsPage() {
  const { state, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [receiptTransaction, setReceiptTransaction] = useState(null);

  // Every transaction notification has a `transactionId` going forward, but
  // notifications created before that link existed don't. Those still pair
  // 1:1 with a transaction in the same newest-first order they were created
  // in, so fall back to matching by position for old data.
  const txNotifications = state.notifications.filter((n) => n.type === "transaction");
  const receiptByNotificationId = new Map();
  txNotifications.forEach((n, i) => {
    const tx = n.transactionId
      ? state.transactions.find((t) => t.id === n.transactionId)
      : state.transactions[i];
    if (tx) receiptByNotificationId.set(n.id, tx);
  });

  const handleOpen = (n) => {
    markNotificationRead(n.id);
    const tx = receiptByNotificationId.get(n.id);
    if (tx) setReceiptTransaction(tx);
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Updates from your account, including anything applied by an administrator."
        action={
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="flex items-center gap-2 rounded-full border border-[rgba(177,18,38,0.3)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/5"
          >
            <CheckCheck size={14} />
            Mark all as read
          </button>
        }
      />

      <div className="mt-6 px-6 sm:px-8">
        <div className="glass-panel divide-y divide-white/5 rounded-2xl">
          {state.notifications.length === 0 && (
            <p className="p-6 text-sm text-[#B3B3B3]">You&apos;re all caught up — no notifications yet.</p>
          )}
          {state.notifications.map((n) => {
            const Icon = TYPE_ICON[n.type] ?? Bell;
            const hasReceipt = receiptByNotificationId.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => handleOpen(n)}
                className="flex w-full items-start gap-3.5 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                    n.read ? "border-white/10 bg-white/[0.03]" : "border-[rgba(177,18,38,0.4)] bg-[rgba(177,18,38,0.1)]"
                  }`}
                >
                  <Icon size={15} className={n.read ? "text-[#B3B3B3]" : "text-[#EF4444]"} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${n.read ? "text-[#B3B3B3]" : "text-white"}`}>{n.title}</p>
                    {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#EF4444]" />}
                  </div>
                  <p className="mt-0.5 text-xs text-[#B3B3B3]">{n.message}</p>
                  <p className="mt-1 text-[11px] text-[#6a6a6a]">{n.date}</p>
                </div>
                {hasReceipt && (
                  <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#D62839]">
                    <Receipt size={13} />
                    Receipt
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ReceiptModal
        transaction={receiptTransaction}
        profile={state.profile}
        onClose={() => setReceiptTransaction(null)}
      />
    </>
  );
}
