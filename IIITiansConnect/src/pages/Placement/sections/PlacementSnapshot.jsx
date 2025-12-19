export default function PlacementSnapshot({ data }) {
  const latest = data.yearlyPlacements.reduce((a, b) =>
    b.year > a.year ? b : a
  );

  const stats = latest.placements.reduce(
    (acc, p) => {
      acc.students += p.totalStudents;
      acc.placed += p.studentsPlaced;
      acc.highest = Math.max(acc.highest, p.highestPackage);
      acc.avg += p.averagePackage;
      acc.count++;
      return acc;
    },
    { students: 0, placed: 0, highest: 0, avg: 0, count: 0 }
  );

  return (
    <section
      className="
        relative sm:bg-gradient-to-br from-indigo-50 via-white to-blue-50
        sm:border rounded-3xl
        p-5 sm:p-8
      "
    >
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Overall Placement Snapshot
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Consolidated performance for {latest.year}
        </p>
      </div>

      {/* Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
  <Stat label="Total Students" value={stats.students} />
  <Stat
    label="Students Placed"
    value={stats.placed}
    // accent="green"
  />
  <Stat
    label="Avg Package"
    value={`${(stats.avg / stats.count).toFixed(2)} LPA`}
    // accent="blue"
  />
  <Stat
    label="Highest Package"
    value={`${stats.highest} LPA`}
    // accent="indigo"
  />
</div>

    </section>
  );
}

/* ---------------- KPI Card ---------------- */

function Stat({ label, value, accent }) {
  const accentStyles = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
  };

  return (
    <div
      className="
        bg-white rounded-xl sm:rounded-2xl
        p-3 sm:p-5
        shadow-sm
        flex flex-col justify-between
      "
    >
      <p className="text-[11px] sm:text-xs text-gray-500 mb-1 sm:mb-2">
        {label}
      </p>

      <p
        className={`
          text-lg sm:text-2xl font-bold tracking-tight
          ${accent ? accentStyles[accent] : "text-gray-900"}
          px-2 sm:px-3 py-1 rounded-lg
          inline-block w-fit
        `}
      >
        {value}
      </p>
    </div>
  );
}
