import { useState } from "react";
import { KeyRound } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAppStore } from "../../store/AppStoreContext";

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

export default function AdminOverviewPage() {
  const { state, adminSetAccessKey } = useAppStore();

  const [accessKey, setAccessKey] = useState(state.privateAccessKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    adminSetAccessKey(accessKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Overview"
        description="The key required to sign up."
      />

      <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-6 px-6 sm:px-8">
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <KeyRound size={15} className="text-[#EF4444]" />
            <span className="text-sm font-medium text-white">Private Access Key</span>
          </div>
          <p className="mt-1 text-xs text-[#B3B3B3]">
            New investors must enter this exact key when signing up. Anyone who gets it wrong can&apos;t
            create an account.
          </p>
          <div className="mt-4">
            <Field
              label="Access Key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] sm:w-auto sm:px-10"
          >
            {saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}
