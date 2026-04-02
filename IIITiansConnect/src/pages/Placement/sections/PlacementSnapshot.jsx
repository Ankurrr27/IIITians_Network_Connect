import {
  formatLpa,
  summarizeAllYears,
} from "../shared/placementInsights";

export default function PlacementSnapshot({ data }) {
  const summaries = summarizeAllYears(data?.yearlyPlacements || []);
  const latest = summaries[0];
  const previous = summaries[1];

  if (!latest) return null;

  const placementDelta = previous
    ? latest.placementRate - previous.placementRate
    : null;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5 shadow-sm sm:p-8">
      <div className="mb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
          Placement Snapshot
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          Overall placement story
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Consolidated performance for {latest.year}, built from all visible
          branch data.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
        <Stat label="Students covered" value={latest.totalStudents} />
        <Stat label="Students placed" value={latest.studentsPlaced} />
        <Stat label="Weighted average" value={formatLpa(latest.averagePackage)} />
        <Stat label="Highest package" value={formatLpa(latest.highestPackage)} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <InsightCard
          label="Placement rate"
          value={`${latest.placementRate.toFixed(1)}%`}
          note={
            placementDelta === null
              ? "First recorded comparison point on this page."
              : `${placementDelta >= 0 ? "+" : ""}${placementDelta.toFixed(
                  1
                )} pts vs ${previous.year}`
          }
        />
        <InsightCard
          label="Top branch"
          value={latest.topBranch?.branch || "N/A"}
          note={
            latest.topBranch
              ? `${latest.topBranch.placementPercentage.toFixed(1)}% placement rate`
              : "No branch-level summary available."
          }
        />
        <InsightCard
          label="Branches reported"
          value={latest.branchCount}
          note={`Across ${latest.year}`}
        />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-[11px] text-slate-500 sm:text-xs">{label}</p>
      <p className="mt-2 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function InsightCard({ label, value, note }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/85 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-900 sm:text-lg">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-600">{note}</p>
    </div>
  );
}
