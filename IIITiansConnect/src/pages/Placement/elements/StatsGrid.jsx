const COLORS = [
  "border-indigo-500",
  "border-green-500",
  "border-amber-500",
  "border-rose-500",
];

export default function StatsGrid({ yearData, allYearsData }) {
  /* ================= SINGLE YEAR ================= */
  if (yearData) {
    const p = yearData.placements;

    const highest = Math.max(...p.map(x => x.highestPackage));
    const avg =
      p.reduce((s, x) => s + x.averagePackage, 0) / p.length;
    const percent = Math.max(...p.map(x => x.placementPercentage));

    return (
      <div className="grid sm:grid-cols-3 gap-6">
        <Stat title="Highest Package" value={`${highest} LPA`} />
        <Stat title="Average Package" value={`${avg.toFixed(1)} LPA`} />
        <Stat title="Placement %" value={`${percent}%`} />
      </div>
    );
  }

  /* ================= ALL YEARS ================= */
  if (!allYearsData?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Year-wise Placement Comparison
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allYearsData.map((yearBlock, i) => {
          const p = yearBlock.placements;

          const highest = Math.max(
            ...p.map(x => x.highestPackage)
          );

          const avg =
            p.reduce((s, x) => s + x.averagePackage, 0) / p.length;

          const percent = Math.max(
            ...p.map(x => x.placementPercentage)
          );

          return (
            <div
              key={yearBlock.year}
              className={`
                border-l-4 ${COLORS[i % COLORS.length]}
                bg-white rounded-xl p-5 shadow-sm
              `}
            >
              <p className="text-sm font-medium text-gray-500 mb-2">
                {yearBlock.year}
              </p>

              <div className="space-y-1">
                <StatRow label="Highest" value={`${highest} LPA`} />
                <StatRow label="Average" value={`${avg.toFixed(1)} LPA`} />
                <StatRow label="Placed" value={`${percent}%`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Single Stat Card ---------------- */

function Stat({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
}

/* ---------------- Compact Row ---------------- */

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
