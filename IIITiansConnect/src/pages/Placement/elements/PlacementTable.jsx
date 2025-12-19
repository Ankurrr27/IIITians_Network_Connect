import { ArrowUpRight, Award } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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
    <div className="bg-white sm:border rounded-2xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Branch-wise Placement Details
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Ranked by placement percentage
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 p-4 sm:p-6">
        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-xs sm:text-sm">
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
                    <td className="p-3 font-semibold text-gray-500">
                      {i + 1}
                    </td>

                    <td className="p-3 font-medium text-gray-900 flex items-center gap-1">
                      {p.branch}
                      {isTop && (
                        <span className="text-indigo-600">
                          <Award size={12} />
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right font-semibold text-indigo-600">
                      {p.highestPackage} LPA
                    </td>

                    <td className="p-3 text-right text-gray-800">
                      {p.averagePackage} LPA
                    </td>

                    <td className="p-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${
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

        {/* PIE */}
        <div className="h-[220px] sm:h-[260px] lg:h-[320px] flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
            Placement Distribution
          </p>
          <p className="text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
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
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
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
