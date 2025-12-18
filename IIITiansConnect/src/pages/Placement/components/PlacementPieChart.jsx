import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { METRIC_COLORS } from "./constants";

export default function PlacementPieChart({ yearData }) {
  return (
    <section className="bg-white border rounded-2xl p-6 shadow-sm">
      <h4 className="text-lg font-semibold mb-4">
        Placement Distribution — {yearData.year}
      </h4>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={yearData.placements}
            dataKey="placementPercentage"
            nameKey="branch"
            outerRadius={120}
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {yearData.placements.map((_, i) => (
              <Cell
                key={i}
                fill={Object.values(METRIC_COLORS)[i % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}
