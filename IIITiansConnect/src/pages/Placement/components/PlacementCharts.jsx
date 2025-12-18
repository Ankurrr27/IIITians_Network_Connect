import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const METRIC_COLORS = {
  highest: "#6366f1",
  average: "#22c55e",
  lowest: "#f59e0b",
};

export default function PlacementCharts({
  yearlyPlacements = [],
  yearData, // null = All Years
}) {
  if (!yearlyPlacements.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        No chart data available
      </div>
    );
  }

  /* ================= SINGLE YEAR VIEW ================= */
  if (yearData) {
    const isSingleBranch = yearData.placements.length === 1;

    return (
      <div className="space-y-16">
        {/* -------- Legend -------- */}
        <Legend />

        {/* -------- Branch-wise Bar Chart -------- */}
        <section
          className={`bg-white border rounded-3xl p-8 shadow-sm ${
            isSingleBranch ? "max-w-3xl mx-auto" : ""
          }`}
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-1">
            Branch-wise Package Comparison — {yearData.year}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Highest, average, and lowest packages across branches
          </p>

          {isSingleBranch && (
            <p className="text-sm text-amber-600 mb-4">
              Only one branch available for this year
            </p>
          )}

          <ResponsiveContainer
            width="100%"
            height={isSingleBranch ? 300 : 420}
          >
            <BarChart
              data={yearData.placements}
              barCategoryGap={isSingleBranch ? 40 : 24}
            >
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="highestPackage"
                name="Highest Package"
                fill={METRIC_COLORS.highest}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="averagePackage"
                name="Average Package"
                fill={METRIC_COLORS.average}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="lowestPackage"
                name="Lowest Package"
                fill={METRIC_COLORS.lowest}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* -------- Distribution -------- */}
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
      </div>
    );
  }

  /* ================= ALL YEARS VIEW ================= */
  const clusteredData = yearlyPlacements.map((y) => {
    const highest = Math.max(
      ...y.placements.map((p) => p.highestPackage)
    );
    const average =
      y.placements.reduce(
        (s, p) => s + p.averagePackage,
        0
      ) / y.placements.length;
    const lowest = Math.min(
      ...y.placements.map((p) => p.lowestPackage)
    );

    return {
      year: y.year,
      highest: Number(highest.toFixed(1)),
      average: Number(average.toFixed(1)),
      lowest: Number(lowest.toFixed(1)),
    };
  });

  return (
    <section className="bg-white border rounded-3xl p-8 shadow-sm space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">
          Year-wise Package Comparison
        </h3>
        <p className="text-sm text-gray-600">
          Clustered comparison of highest, average, and lowest
          packages across years
        </p>
      </div>

      <Legend />

      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={clusteredData}
          barCategoryGap={32}
        >
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="highest"
            name="Highest"
            fill={METRIC_COLORS.highest}
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="average"
            name="Average"
            fill={METRIC_COLORS.average}
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="lowest"
            name="Lowest"
            fill={METRIC_COLORS.lowest}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

/* ================= Legend ================= */

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
      <LegendItem
        color={METRIC_COLORS.highest}
        label="Highest Package"
      />
      <LegendItem
        color={METRIC_COLORS.average}
        label="Average Package"
      />
      <LegendItem
        color={METRIC_COLORS.lowest}
        label="Lowest Package"
      />
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}
