import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAppStore } from "../../store/AppStoreContext";

export default function CardsPage() {
  const { state, addCard } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    addCard({ label: label.trim(), brand: "Visa Infinite", last4, expiry: "12/29", status: "active" });
    setLabel("");
    setShowForm(false);
  };

  return (
    <>
      <PageHeader
        title="Cards"
        description="Cards linked to your private access account."
        action={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus size={14} />
            Add Card
          </button>
        }
      />

      <div className="mt-6 px-6 sm:px-8">
        {showForm && (
          <form
            onSubmit={handleAdd}
            className="glass-panel mb-5 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-end"
          >
            <label className="flex-1">
              <span className="text-xs font-medium text-[#B3B3B3]">Card Nickname</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Travel Card"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Issue Card
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {state.cards.map((card) => (
            <div
              key={card.id}
              className="glass-panel relative overflow-hidden rounded-2xl p-6"
            >
              <div
                className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(177,18,38,0.5), transparent 70%)" }}
              />
              <div className="flex items-center justify-between">
                <CreditCard size={22} className="text-[#D62839]" />
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-400">
                  {card.status}
                </span>
              </div>
              <p className="mt-6 font-serif text-lg text-white">{card.label}</p>
              <p className="mt-1 text-sm tracking-widest text-[#B3B3B3]">&bull;&bull;&bull;&bull; {card.last4}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-[#B3B3B3]">
                <span>{card.brand}</span>
                <span>Exp {card.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
