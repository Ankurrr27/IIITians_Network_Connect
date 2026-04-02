import {
  formatLpa,
  summarizeAllYears,
  summarizePlacementYear,
} from "../shared/placementInsights";

export default function StatsGrid({ yearData, allYearsData }) {
  if (yearData) {
    const summary = summarizePlacementYear(yearData);
    if (!summary) return null;

    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Highest package"
          value={formatLpa(summary.highestPackage)}
          note="Best reported offer in the selected year"
          accent="from-indigo-500/15 to-indigo-50"
        />
        <StatCard
          title="Weighted average"
          value={formatLpa(summary.averagePackage)}
          note="Weighted using total students recorded by branch"
          accent="from-emerald-500/12 to-emerald-50"
        />
        <StatCard
          title="Median package"
          value={formatLpa(summary.medianPackage)}
          note="Median of recorded branch average packages"
          accent="from-amber-500/12 to-amber-50"
        />
        <StatCard
          title="Highest placement"
          value={`${summary.highestPlacementPercentage.toFixed(1)}%`}
          note={
            summary.topBranch
              ? `${summary.topBranch.branch} leads this year`
              : `${summary.studentsPlaced}/${summary.totalStudents} students placed`
          }
          accent="from-sky-500/12 to-sky-50"
        />
      </div>
    );
  }

  const summaries = summarizeAllYears(allYearsData || []);
  if (!summaries.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
          Multi-Year View
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          Year-wise placement comparison
        </h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {summaries.map((summary) => (
          <div
            key={summary.year}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  {summary.year}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-slate-900">
                  Placement snapshot
                </h4>
              </div>
              <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {summary.branchCount} branches
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <StatRow label="Highest package" value={formatLpa(summary.highestPackage)} />
              <StatRow label="Weighted average" value={formatLpa(summary.averagePackage)} />
              <StatRow label="Median package" value={formatLpa(summary.medianPackage)} />
              <StatRow
                label="Placement rate"
                value={`${summary.placementRate.toFixed(1)}%`}
              />
              <StatRow
                label="Highest placement"
                value={`${summary.highestPlacementPercentage.toFixed(1)}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ title, value, note, accent }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-slate-200 bg-gradient-to-br ${accent} p-5 shadow-sm`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
        {title}
      </p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
