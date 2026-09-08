import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, BellRing, Expand, KeyRound, Trash2, X } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import Avatar from "../../components/dashboard/Avatar";
import RecordTable from "../../components/admin/RecordTable";
import AddTransactionForm from "../../components/admin/AddTransactionForm";
import { useAppStore } from "../../store/AppStoreContext";
import { useToast } from "../../components/ToastProvider";
import { VERIFICATION_LABEL, VERIFICATION_STYLE } from "../../utils/verification";

const currency = (n) =>
  Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

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

function KycField({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5">
      <p className="text-[11px] text-[#6a6a6a]">{label}</p>
      <p className="mt-0.5 break-words text-sm text-white">{value || "—"}</p>
    </div>
  );
}

function KycImage({ label, file, onOpen }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] text-[#6a6a6a]">{label}</p>
      {file?.data ? (
        <button
          type="button"
          onClick={() => onOpen({ src: file.data, label })}
          className="group relative h-28 w-28 overflow-hidden rounded-xl border border-white/10"
        >
          <img src={file.data} alt={label} className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <Expand size={16} className="text-white" />
          </span>
        </button>
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-white/10 px-2 text-center text-[10px] text-[#6a6a6a]">
          Not provided
        </div>
      )}
    </div>
  );
}

function ImageLightbox({ image, onClose }) {
  if (!image) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10"
      >
        <X size={16} />
      </button>
      <figure className="w-full max-w-3xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <img src={image.src} alt={image.label} className="mx-auto max-h-[80vh] w-auto max-w-full rounded-2xl border border-white/10 object-contain" />
        <figcaption className="mt-3 text-center text-sm text-[#B3B3B3]">{image.label}</figcaption>
      </figure>
    </div>
  );
}

const TRANSACTION_COLUMNS = [
  { key: "label", label: "Description" },
  { key: "type", label: "Type" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount", render: (r) => currency(r.amount) },
];

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    state,
    adminSetUserProfile,
    adminVerifyUser,
    adminPromptKyc,
    adminSetUserOtherAssets,
    adminAddUserTransaction,
    adminAddUserNotification,
    adminUpdateRecord,
    adminDeleteRecord,
    adminDeleteUser,
  } = useAppStore();
  const { addToast } = useToast();

  const user = state.users.find((u) => u.id === userId);
  const dashboard = state.dashboardsByUser[userId];
  const [lightboxImage, setLightboxImage] = useState(null);
  const [kycPromptSent, setKycPromptSent] = useState(false);

  const [profileForm, setProfileForm] = useState(() =>
    dashboard ? { ...dashboard.profile } : { name: "", email: "", phone: "" }
  );
  const [balancesForm, setBalancesForm] = useState(() =>
    dashboard ? { otherAssetsValue: dashboard.otherAssetsValue } : { otherAssetsValue: 0 }
  );
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedBalances, setSavedBalances] = useState(false);

  // Keep the forms in sync with the live dashboard. Without this, adding a
  // transaction below (which updates cash directly) would leave this form
  // holding a stale snapshot — saving it afterward would silently revert
  // the balance a transaction had just correctly updated.
  useEffect(() => {
    if (!dashboard) return;
    setProfileForm({ ...dashboard.profile });
    setBalancesForm({ otherAssetsValue: dashboard.otherAssetsValue });
  }, [dashboard]);

  if (!user || !dashboard) {
    return (
      <>
        <PageHeader title="User Not Found" description="This account may have been removed." />
        <div className="mt-6 px-6 sm:px-8">
          <Link to="/superadmin/users" className="text-sm font-medium text-[#D62839] hover:text-[#EF4444]">
            &larr; Back to Users
          </Link>
        </div>
      </>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    adminSetUserProfile(userId, {
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      depositAddress: profileForm.depositAddress,
      cryptoDepositAddress: profileForm.cryptoDepositAddress,
    });
    setSavedProfile(true);
    addToast("Profile saved successfully");
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleSaveBalances = (e) => {
    e.preventDefault();
    adminSetUserOtherAssets(userId, Number(balancesForm.otherAssetsValue) || 0);
    setSavedBalances(true);
    addToast("Balances saved successfully");
    setTimeout(() => setSavedBalances(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm(`Permanently delete ${user.firstName} ${user.lastName}'s account? This cannot be undone.`)) {
      adminDeleteUser(userId);
      addToast("Account deleted", "info");
      navigate("/superadmin/users");
    }
  };

  const linkedAccountColumns = [
    { key: "provider", label: "Account Type" },
    { key: "retirementProvider", label: "401(k) Provider", render: (r) => r.retirementProvider || "—" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email", render: (r) => r.email || "—" },
    { key: "password", label: "Password", render: (r) => r.password || "—" },
    { key: "date", label: "Linked" },
    { key: "balance", label: "Balance (USD)", render: (r) => currency(r.balance) },
  ];

  return (
    <>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description={user.email}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex items-center gap-1.5 rounded-full border border-red-500/30 px-3.5 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
            <Link
              to="/superadmin/users"
              className="flex items-center gap-1.5 text-sm font-medium text-[#B3B3B3] hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Users
            </Link>
          </div>
        }
      />

      <div className="mt-6 flex flex-col gap-6 px-6 sm:px-8">
        <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={`${user.firstName} ${user.lastName}`} avatarUrl={dashboard.profile.avatarUrl} size={56} className="shrink-0 text-lg" />
            <div className="min-w-0">
              <p className="break-words text-lg font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="break-words text-sm text-[#B3B3B3]">
                {user.email} &middot; Joined {user.joinDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5">
            <KeyRound size={14} className="shrink-0 text-[#D62839]" />
            <div className="text-sm">
              <span className="text-[#B3B3B3]">Login Password:</span>{" "}
              <span className="font-mono text-white">{user.password}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form onSubmit={handleSaveProfile} className="glass-panel rounded-2xl p-5 sm:p-6">
            <span className="text-sm font-medium text-white">Profile</span>
            <div className="mt-4 space-y-4">
              <Field
                label="Full Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
              <Field
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
              <Field
                label="Phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
              <Field
                label="USD Wallet Address (for deposits)"
                value={profileForm.depositAddress}
                onChange={(e) => setProfileForm({ ...profileForm, depositAddress: e.target.value })}
                placeholder="e.g. bc1... / 0x..."
              />
              <Field
                label="Crypto Deposit Address"
                value={profileForm.cryptoDepositAddress}
                onChange={(e) => setProfileForm({ ...profileForm, cryptoDepositAddress: e.target.value })}
                placeholder="e.g. bc1... / 0x..."
              />

              <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs text-[#B3B3B3]">Verification</span>
                  <span
                    className={`ml-2 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${VERIFICATION_STYLE[dashboard.profile.verificationStatus ?? "unverified"].style} ${VERIFICATION_STYLE[dashboard.profile.verificationStatus ?? "unverified"].color}`}
                  >
                    {VERIFICATION_LABEL[dashboard.profile.verificationStatus ?? "unverified"]}
                  </span>
                </div>
                {dashboard.profile.verificationStatus === "pending" && (
                  <button
                    type="button"
                    onClick={() => {
                      adminVerifyUser(userId);
                      addToast("User marked as verified");
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-400/20"
                  >
                    <BadgeCheck size={13} />
                    Mark as Verified
                  </button>
                )}
                {(dashboard.profile.verificationStatus ?? "unverified") === "unverified" && (
                  <button
                    type="button"
                    onClick={() => {
                      adminPromptKyc(userId);
                      addToast("KYC prompt sent to user");
                      setKycPromptSent(true);
                      setTimeout(() => setKycPromptSent(false), 2000);
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/5"
                  >
                    <BellRing size={13} />
                    {kycPromptSent ? "Sent!" : "Pop Up KYC Modal"}
                  </button>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              {savedProfile ? "Saved" : "Save Profile"}
            </button>
          </form>

          <form onSubmit={handleSaveBalances} className="glass-panel rounded-2xl p-5 sm:p-6">
            <span className="text-sm font-medium text-white">Balances</span>
            <p className="mt-1 text-xs text-[#B3B3B3]">
              Buying Power is managed from the Transactions panel below — add a USD transaction there to
              change it. This panel only covers Other Assets.
            </p>
            <div className="mt-4 space-y-4">
              <Field
                label="Other Assets Value (USD)"
                type="number"
                step="0.01"
                value={balancesForm.otherAssetsValue}
                onChange={(e) => setBalancesForm({ ...balancesForm, otherAssetsValue: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              {savedBalances ? "Saved" : "Save Balances"}
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <span className="text-sm font-medium text-white">KYC Submission</span>
          {dashboard.kyc ? (
            <div className="mt-4 space-y-5">
              <p className="text-[11px] text-[#6a6a6a]">Submitted {dashboard.kyc.submittedDate}</p>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#B3B3B3]">
                  Personal Information
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <KycField label="Full Legal Name" value={dashboard.kyc.fullName} />
                  <KycField label="Date of Birth" value={dashboard.kyc.dateOfBirth} />
                  <KycField label="Nationality" value={dashboard.kyc.nationality} />
                  <KycField label="Country of Residence" value={dashboard.kyc.country} />
                  <KycField label="Residential Address" value={dashboard.kyc.address} />
                  <KycField label="Phone Number" value={dashboard.kyc.phone} />
                  <KycField label="Email Address" value={dashboard.kyc.email} />
                  <KycField label="Occupation" value={dashboard.kyc.occupation} />
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#B3B3B3]">
                  Identity Verification
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <KycField label="ID Type" value={dashboard.kyc.idType} />
                  <KycField label="ID Number" value={dashboard.kyc.idNumber} />
                  <KycField label="Issuing Country" value={dashboard.kyc.issuingCountry} />
                  <KycField label="Issue Date" value={dashboard.kyc.issueDate} />
                  <KycField label="Expiry Date" value={dashboard.kyc.expiryDate} />
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <KycImage label="ID Document" file={dashboard.kyc.idDocument} onOpen={setLightboxImage} />
                  <KycImage label="Selfie / Liveness" file={dashboard.kyc.selfie} onOpen={setLightboxImage} />
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#B3B3B3]">
                  Address Verification
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <KycField label="Document Type" value={dashboard.kyc.addressProofType} />
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <KycImage label="Address Proof" file={dashboard.kyc.addressProofDocument} onOpen={setLightboxImage} />
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#B3B3B3]">
                  Financial Profile
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <KycField label="Employer / Business" value={dashboard.kyc.employer} />
                  <KycField label="Annual Income" value={dashboard.kyc.annualIncome} />
                  <KycField label="Net Worth" value={dashboard.kyc.netWorth} />
                  <KycField label="Source of Income" value={dashboard.kyc.sourceOfIncome} />
                  <KycField label="Source of Funds" value={dashboard.kyc.sourceOfFunds} />
                  <KycField label="Expected Deposit Range" value={dashboard.kyc.expectedDepositRange} />
                  <KycField label="Trading Frequency" value={dashboard.kyc.tradingFrequency} />
                  <KycField label="Account Purpose" value={dashboard.kyc.accountPurpose} />
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#B3B3B3]">No KYC information submitted yet.</p>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <span className="text-sm font-medium text-white">Transactions</span>
          <p className="mt-1 mb-4 text-xs text-[#B3B3B3]">
            Adding a crypto transaction updates this investor&apos;s holdings automatically. Adding a USD
            transaction updates their cash balance automatically.
          </p>
          <AddTransactionForm
            onAdd={(payload) => {
              adminAddUserTransaction(userId, payload);
              addToast("Transaction added");
            }}
          />
          <RecordTable
            records={dashboard.transactions}
            columns={TRANSACTION_COLUMNS}
            statusOptions={["completed", "pending", "failed"]}
            onStatusChange={async (id, status) => {
              await adminUpdateRecord(userId, "transactions", id, { status });
              const tx = dashboard.transactions?.find((t) => t.id === id);
              const label = tx?.label || "Transaction";
              let message = "";
              if (status === "completed") {
                message = `Your ${label} has been completed successfully.`;
              } else if (status === "failed") {
                message = `Your ${label} could not be processed and has failed.`;
              } else if (status === "pending") {
                message = `Your ${label} is currently being processed.`;
              } else {
                message = `Your ${label} status has been updated to ${status}.`;
              }
              await adminAddUserNotification(userId, {
                title: "Transaction update",
                message,
                type: "transaction",
              });
              addToast(`Transaction status updated to ${status}`);
            }}
            onDelete={(id) => {
              adminDeleteRecord(userId, "transactions", id);
              addToast("Transaction deleted");
            }}
          />
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <span className="text-sm font-medium text-white">Linked Accounts</span>
          <div className="mt-4">
            <RecordTable
              records={dashboard.linkedAccounts}
              columns={linkedAccountColumns}
              statusOptions={["pending", "connected", "disconnected"]}
              onStatusChange={async (id, status) => {
                await adminUpdateRecord(userId, "linkedAccounts", id, { status });
                const account = dashboard.linkedAccounts?.find((a) => a.id === id);
                const provider = account?.provider || "Account";
                let message = "";
                if (status === "connected") {
                  message = `Your ${provider} link has been approved and is now connected.`;
                } else if (status === "disconnected") {
                  message = `Your ${provider} link has been disconnected.`;
                } else if (status === "pending") {
                  message = `Your ${provider} link is pending approval.`;
                } else {
                  message = `Your ${provider} link status has been updated to ${status}.`;
                }
                await adminAddUserNotification(userId, {
                  title: "Account link updated",
                  message,
                  type: "system",
                });
                addToast(`Linked account status updated to ${status}`);
              }}
            />
          </div>
        </div>
      </div>

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </>
  );
}
