import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { METRIC_COLORS } from "./constants";

export default function BranchBarChart({ yearData }) {
  const isSingleBranch = yearData.placements.length === 1;

  return (
    <section className="bg-white border rounded-3xl p-8 shadow-sm">
      <h3 className="text-2xl font-semibold mb-1 text-gray-900">
        Branch-wise Package Comparison — {yearData.year}
      </h3>

      {isSingleBranch && (
        <p className="text-sm text-amber-600 mb-4">
          Only one branch available
        </p>
      )}

      <ResponsiveContainer width="100%" height={isSingleBranch ? 300 : 420}>
        <BarChart
          data={yearData.placements}
          barCategoryGap={isSingleBranch ? 40 : 28}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="branch" />
          <YAxis />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
            }}
          />

          <Bar
            dataKey="highestPackage"
            fill={METRIC_COLORS.highest}
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="averagePackage"
            fill={METRIC_COLORS.average}
            radius={[8, 8, 0, 0]}
            opacity={0.85}
          />
          <Bar
            dataKey="lowestPackage"
            fill={METRIC_COLORS.lowest}
            radius={[8, 8, 0, 0]}
            opacity={0.75}
          />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
