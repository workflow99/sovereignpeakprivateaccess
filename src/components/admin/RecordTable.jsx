import { Trash2 } from "lucide-react";

function StatusSelect({ value, statusOptions, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs text-white outline-none focus:border-[rgba(177,18,38,0.5)]"
    >
      {statusOptions.map((s) => (
        <option key={s} value={s} className="bg-[#0a0a0c]">
          {s}
        </option>
      ))}
    </select>
  );
}

export default function RecordTable({ records, columns, statusOptions, onStatusChange, onDelete }) {
  if (records.length === 0) {
    return <p className="py-6 text-center text-sm text-[#B3B3B3]">No records yet.</p>;
  }

  const [titleColumn, ...restColumns] = columns;

  return (
    <>
      {/* Card list below lg — this table's column count (data + status + actions) doesn't have
          room to breathe until then, so records are shown stacked instead of forcing a scroll. */}
      <div className="space-y-2.5 lg:hidden">
        {records.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 text-sm font-medium text-white">
                {titleColumn.render ? titleColumn.render(r) : String(r[titleColumn.key] ?? "—")}
              </div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(r.id)}
                  aria-label="Delete record"
                  className="shrink-0 text-[#B3B3B3] hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="mt-2.5 space-y-1.5 text-xs">
              {restColumns.map((c) => (
                <div key={c.key} className="flex items-center justify-between gap-3">
                  <span className="shrink-0 text-[#6a6a6a]">{c.label}</span>
                  <span className="text-right text-[#B3B3B3]">
                    {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                  </span>
                </div>
              ))}
              {statusOptions && (
                <div className="flex items-center justify-between gap-3">
                  <span className="shrink-0 text-[#6a6a6a]">Status</span>
                  <StatusSelect
                    value={r.status}
                    statusOptions={statusOptions}
                    onChange={(status) => onStatusChange(r.id, status)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table from lg up — fluid width, no min-width, so it never needs horizontal scroll. */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-[#B3B3B3]">
              {columns.map((c) => (
                <th key={c.key} className="pb-3 font-medium">
                  {c.label}
                </th>
              ))}
              {statusOptions && <th className="pb-3 font-medium">Status</th>}
              <th className="pb-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-white/5">
                {columns.map((c) => (
                  <td key={c.key} className="py-3 pr-3">
                    {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                  </td>
                ))}
                {statusOptions && (
                  <td className="py-3 pr-3">
                    <StatusSelect
                      value={r.status}
                      statusOptions={statusOptions}
                      onChange={(status) => onStatusChange(r.id, status)}
                    />
                  </td>
                )}
                <td className="py-3 text-right">
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      aria-label="Delete record"
                      className="text-[#B3B3B3] hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
