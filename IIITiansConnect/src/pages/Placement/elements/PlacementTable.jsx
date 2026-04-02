import { ArrowUpRight, Award } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
];

export default function PlacementTable({ placements = [] }) {
  if (!placements.length) return null;

  const sorted = [...placements].sort(
    (a, b) => b.placementPercentage - a.placementPercentage
  );

  const pieData = sorted.map((p) => ({
    name: p.branch,
    value: p.placementPercentage,
  }));

  const topBranch = sorted[0];

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm sm:border sm:rounded-2xl">
      <div className="border-b px-4 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
          Branch-wise Placement Details
        </h3>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Ranked by placement percentage
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[2fr_1fr] lg:gap-6">
        <div className="-mx-1 overflow-x-auto sm:mx-0">
          <table className="min-w-[560px] w-full text-xs sm:min-w-[640px] sm:text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left font-medium">#</th>
                <th className="p-3 text-left font-medium">Branch</th>
                <th className="p-3 text-right font-medium">Highest</th>
                <th className="p-3 text-right font-medium">Average</th>
                <th className="p-3 text-right font-medium">Placed %</th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((p, i) => {
                const isTop = p.branch === topBranch.branch;

                return (
                  <tr
                    key={p.branch}
                    className={`border-t transition ${
                      isTop ? "bg-indigo-50/40" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3 font-semibold text-gray-500">{i + 1}</td>

                    <td className="flex items-center gap-1 p-3 font-medium text-gray-900">
                      {p.branch}
                      {isTop && (
                        <span className="text-indigo-600">
                          <Award size={12} />
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap p-3 text-right font-semibold text-indigo-600">
                      {p.highestPackage} LPA
                    </td>

                    <td className="whitespace-nowrap p-3 text-right text-gray-800">
                      {p.averagePackage} LPA
                    </td>

                    <td className="p-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
                          p.placementPercentage >= 90
                            ? "bg-green-100 text-green-700"
                            : p.placementPercentage >= 70
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.placementPercentage}%
                        {p.placementPercentage >= 90 && (
                          <ArrowUpRight size={11} />
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex h-[220px] flex-col items-center justify-center rounded-[1.25rem] bg-slate-50 p-3 sm:h-[260px] lg:h-[320px]">
          <p className="mb-1 text-xs font-semibold text-gray-700 sm:text-sm">
            Placement Distribution
          </p>
          <p className="mb-2 text-[11px] text-gray-500 sm:mb-3 sm:text-xs">
            Highest share: {topBranch.branch}
          </p>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
