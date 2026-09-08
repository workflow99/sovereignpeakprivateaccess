import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function AllocationDonut({ segments }) {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <span className="text-sm font-medium text-white">Asset Allocation</span>

      <div className="mt-2 flex items-center gap-4">
        <div className="h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="percent"
                nameKey="label"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={2}
                stroke="none"
              >
                {segments.map((s) => (
                  <Cell key={s.label} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#B3B3B3]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="font-medium text-white">{s.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/dashboard/portfolio"
        className="mt-4 inline-block text-xs font-medium text-[#D62839] transition-colors hover:text-[#EF4444]"
      >
        View Full Allocation
      </Link>
    </div>
  );
}
