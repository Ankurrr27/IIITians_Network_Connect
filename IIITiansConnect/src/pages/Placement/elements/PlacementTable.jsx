import { ArrowUpRight } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
];

export default function PlacementTable({ placements = [] }) {
  if (!placements.length) return null;

  // Pie data: placement % per branch
  const pieData = placements.map((p) => ({
    name: p.branch,
    value: p.placementPercentage,
  }));

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Branch-wise Placement Details
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Compare placement performance across different branches.
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 p-6">
        {/* TABLE (LEFT) */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left font-medium">Branch</th>
                <th className="p-4 text-right font-medium">Highest</th>
                <th className="p-4 text-right font-medium">Average</th>
                <th className="p-4 text-right font-medium">Placed %</th>
              </tr>
            </thead>

            <tbody>
              {placements.map((p, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {p.branch}
                  </td>

                  <td className="p-4 text-right font-semibold text-indigo-600">
                    {p.highestPackage} LPA
                  </td>

                  <td className="p-4 text-right text-gray-800">
                    {p.averagePackage} LPA
                  </td>

                  <td className="p-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        p.placementPercentage >= 90
                          ? "bg-green-100 text-green-700"
                          : p.placementPercentage >= 70
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.placementPercentage}%
                      {p.placementPercentage >= 90 && (
                        <ArrowUpRight size={12} />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PIE CHART (RIGHT) */}
        <div className="h-[320px] flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Placement % Distribution
          </p>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
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
