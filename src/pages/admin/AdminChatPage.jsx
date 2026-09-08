import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import Avatar from "../../components/dashboard/Avatar";
import { useAppStore } from "../../store/AppStoreContext";

export default function AdminChatPage() {
  const { state, adminSendChatMessage } = useAppStore();
  const [selectedId, setSelectedId] = useState(state.users[0]?.id ?? null);
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  const selectedUser = state.users.find((u) => u.id === selectedId);
  const dashboard = selectedId ? state.dashboardsByUser[selectedId] : null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [dashboard?.supportChat.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedId) return;
    adminSendChatMessage(selectedId, text.trim());
    setText("");
  };

  return (
    <>
      <PageHeader title="Support Chat" description="Reply to any investor as Project Sovereign Peak Support." />

      <div className="mt-6 px-6 sm:px-8">
        {state.users.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <MessageSquare size={18} className="text-[#B3B3B3]" />
            </span>
            <p className="text-sm text-[#B3B3B3]">No users have signed up yet.</p>
          </div>
        ) : (
          <div className="glass-panel grid grid-cols-1 overflow-hidden rounded-2xl sm:grid-cols-[220px_1fr]">
            <div
              className={`max-h-[520px] overflow-y-auto border-b border-white/5 sm:border-b-0 sm:border-r ${
                showThreadOnMobile ? "hidden sm:block" : "block"
              }`}
            >
              {state.users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(u.id);
                    setShowThreadOnMobile(true);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors ${
                    selectedId === u.id ? "bg-[rgba(177,18,38,0.12)]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <Avatar name={`${u.firstName} ${u.lastName}`} size={30} className="text-xs" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="truncate text-[11px] text-[#B3B3B3]">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>

            <div
              className={`flex-col ${showThreadOnMobile ? "flex" : "hidden sm:flex"}`}
            >
              {selectedUser && (
                <button
                  type="button"
                  onClick={() => setShowThreadOnMobile(false)}
                  className="flex items-center gap-2 border-b border-white/5 px-4 py-3 text-left text-sm font-medium text-[#B3B3B3] transition-colors hover:text-white sm:hidden"
                >
                  <ArrowLeft size={14} />
                  Back to conversations
                </button>
              )}
              <div ref={scrollRef} className="flex h-96 flex-col gap-3 overflow-y-auto px-5 py-4">
                {dashboard?.supportChat.length === 0 && (
                  <p className="m-auto text-sm text-[#B3B3B3]">No messages yet with {selectedUser?.firstName}.</p>
                )}
                {dashboard?.supportChat.map((m) => {
                  const fromAgent = m.sender === "agent";
                  return (
                    <div key={m.id} className={`flex ${fromAgent ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] ${fromAgent ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            fromAgent
                              ? "rounded-br-sm bg-gradient-to-r from-[#B11226] to-[#D62839] text-white"
                              : "rounded-bl-sm border border-white/10 bg-white/[0.04] text-white"
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="mt-1 px-1 text-[10px] text-[#6a6a6a]">
                          {m.author} &middot; {m.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/5 p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={selectedUser ? `Reply to ${selectedUser.firstName} as Project Sovereign Peak Support…` : "Select a user"}
                  disabled={!selectedId}
                  className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)] disabled:opacity-50"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!selectedId}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] text-white transition-shadow hover:shadow-[0_0_16px_rgba(239,68,68,0.5)] disabled:opacity-50"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
