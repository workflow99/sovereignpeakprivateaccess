import { useState } from "react";
import { Plus } from "lucide-react";

function emptyValues(fields) {
  return Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""]));
}

export default function AddRecordForm({ fields, onAdd }) {
  const [values, setValues] = useState(() => emptyValues(fields));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {};
    for (const f of fields) {
      const raw = values[f.key];
      payload[f.key] = f.type === "number" ? Number(raw) || 0 : raw;
    }
    onAdd(payload);
    setValues(emptyValues(fields));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4"
    >
      {fields.map((f) => (
        <label key={f.key} className="min-w-[140px] flex-1">
          <span className="text-xs font-medium text-[#B3B3B3]">{f.label}</span>
          {f.type === "select" ? (
            <select
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            >
              {f.options.map((opt) => (
                <option key={opt} value={opt} className="bg-[#0a0a0c]">
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type ?? "text"}
              step={f.type === "number" ? "0.01" : undefined}
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-sm text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
            />
          )}
        </label>
      ))}
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-4 py-2 text-xs font-semibold text-white"
      >
        <Plus size={13} />
        Add
      </button>
    </form>
  );
}
