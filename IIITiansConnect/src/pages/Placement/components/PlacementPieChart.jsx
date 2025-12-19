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
    <section
      className="
        bg-white border rounded-2xl shadow-sm
        p-4 sm:p-6
      "
    >
      <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        Placement Distribution — {yearData.year}
      </h4>

      <ResponsiveContainer width="100%" height={260} className="sm:h-[320px]">
        <PieChart>
          <Pie
            data={yearData.placements}
            dataKey="placementPercentage"
            nameKey="branch"
            outerRadius={window.innerWidth < 640 ? 90 : 120}
            label={window.innerWidth >= 640}
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
