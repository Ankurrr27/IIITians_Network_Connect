import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { METRIC_COLORS } from "./constants";

export default function YearClusterBarChart({ yearlyPlacements }) {
  const data = yearlyPlacements.map((y) => {
    const highest = Math.max(...y.placements.map(p => p.highestPackage));
    const lowest = Math.min(...y.placements.map(p => p.lowestPackage));
    const average =
      y.placements.reduce((s, p) => s + p.averagePackage, 0) /
      y.placements.length;

    return {
      year: y.year,
      highest: +highest.toFixed(1),
      average: +average.toFixed(1),
      lowest: +lowest.toFixed(1),
    };
  });

  return (
    <section className="bg-white border rounded-3xl p-8 shadow-sm">
      <h3 className="text-2xl font-semibold mb-4">
        Year-wise Package Comparison
      </h3>

      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} barCategoryGap={32}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="highest" fill={METRIC_COLORS.highest} />
          <Bar dataKey="average" fill={METRIC_COLORS.average} />
          <Bar dataKey="lowest" fill={METRIC_COLORS.lowest} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
