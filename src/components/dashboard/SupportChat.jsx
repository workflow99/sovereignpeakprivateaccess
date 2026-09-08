import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useAppStore } from "../../store/AppStoreContext";

export default function SupportChat() {
  const { state, sendChatMessage } = useAppStore();
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [state.supportChat.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage(text.trim());
    setText("");
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(177,18,38,0.3)] bg-[rgba(177,18,38,0.1)]">
          <MessageCircle size={16} className="text-[#D62839]" />
        </span>
        <div>
          <p className="text-sm font-medium text-white">Live Chat</p>
          <p className="text-xs text-[#B3B3B3]">Get help from our trusted agents through our chat.</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex h-80 flex-col gap-3 overflow-y-auto px-5 py-4">
        {state.supportChat.map((m) => {
          const fromUser = m.sender === "user";
          return (
            <div key={m.id} className={`flex ${fromUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] ${fromUser ? "items-end" : "items-start"} flex flex-col`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    fromUser
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
          placeholder="Type a reply…"
          className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] text-white transition-shadow hover:shadow-[0_0_16px_rgba(239,68,68,0.5)]"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
