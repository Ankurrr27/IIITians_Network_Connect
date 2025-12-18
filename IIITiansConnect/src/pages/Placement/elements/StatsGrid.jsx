/* ================= Helpers ================= */

function calculateMetrics(placements) {
  const highest = Math.max(...placements.map(p => p.highestPackage));

  const average =
    placements.reduce((s, p) => s + p.averagePackage, 0) /
    placements.length;

  const percent = Math.max(
    ...placements.map(p => p.placementPercentage)
  );

  return {
    highest,
    average: +average.toFixed(1),
    percent,
  };
}

/* Stable year → color mapping (NOT index-based) */
const YEAR_COLORS = {
  2021: "border-indigo-500",
  2022: "border-emerald-500",
  2023: "border-amber-500",
  2024: "border-rose-500",
};

/* ================= Component ================= */

export default function StatsGrid({ yearData, allYearsData }) {
  /* ========== SINGLE YEAR VIEW ========== */
  if (yearData) {
    const metrics = calculateMetrics(yearData.placements);

    return (
      <div className="grid sm:grid-cols-3 gap-6">
        <Stat
          title="Highest Package"
          value={`${metrics.highest} LPA`}
          accent="border-indigo-500"
        />
        <Stat
          title="Average Package"
          value={`${metrics.average} LPA`}
          accent="border-emerald-500"
        />
        <Stat
          title="Placement Rate"
          value={`${metrics.percent}%`}
          accent="border-amber-500"
        />
      </div>
    );
  }

  /* ========== ALL YEARS VIEW ========== */
  if (!allYearsData?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Year-wise Placement Comparison
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allYearsData.map((yearBlock) => {
          const metrics = calculateMetrics(yearBlock.placements);

          const accent =
            YEAR_COLORS[yearBlock.year] ??
            "border-gray-300";

          return (
            <div
              key={yearBlock.year}
              className={`
                bg-white border-l-4 ${accent}
                rounded-xl p-5 shadow-sm
              `}
            >
              <p className="text-sm font-medium text-gray-500 mb-2">
                {yearBlock.year}
              </p>

              <div className="space-y-1">
                <StatRow
                  label="Highest"
                  value={`${metrics.highest} LPA`}
                />
                <StatRow
                  label="Average"
                  value={`${metrics.average} LPA`}
                />
                <StatRow
                  label="Placed"
                  value={`${metrics.percent}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= UI Primitives ================= */

function Stat({ title, value, accent }) {
  return (
    <div
      className={`
        bg-white border-l-4 ${accent}
        rounded-xl p-6 shadow-sm
      `}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold mt-1 text-gray-900">
        {value}
      </h3>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}
