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
    <section
      className="
        bg-white border rounded-3xl shadow-sm
        p-4 sm:p-8
      "
    >
      <h3 className="text-base sm:text-2xl font-semibold mb-3 sm:mb-4">
        Year-wise Package Comparison
      </h3>

      <div className="h-[260px] sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap={window.innerWidth < 640 ? 16 : 32}
            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
          >
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar
              dataKey="highest"
              fill={METRIC_COLORS.highest}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="average"
              fill={METRIC_COLORS.average}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="lowest"
              fill={METRIC_COLORS.lowest}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
