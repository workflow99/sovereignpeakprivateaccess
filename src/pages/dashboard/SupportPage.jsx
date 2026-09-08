import { useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import SupportChat from "../../components/dashboard/SupportChat";
import { useAppStore } from "../../store/AppStoreContext";

export default function SupportPage() {
  const { submitSupportTicket } = useAppStore();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    submitSupportTicket({ subject: subject.trim(), message: message.trim() });
    setSubject("");
    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <>
      <PageHeader title="Support" description="Get help from your private client team." />

      <div className="mt-6 px-6 sm:px-8">
        <SupportChat />
      </div>

      <div className="mt-6 px-6 sm:px-8">
        <form onSubmit={handleSubmit} className="glass-panel max-w-xl rounded-2xl p-5 sm:p-6">
          <span className="text-sm font-medium text-white">Contact Support</span>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-[#B3B3B3]">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          </label>
          {sent && <p className="mt-3 text-xs text-emerald-400">Your message was sent.</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] py-2.5 text-sm font-semibold text-white"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
