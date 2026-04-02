export default function PlacementHeader({ collegeName }) {
  return (
    <header className="max-w-3xl space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
        Placement Insights
      </p>

      <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
        {collegeName ? `${collegeName} placements` : "Compare IIIT placements"}
      </h1>

      <p className="text-sm leading-7 text-slate-600 sm:text-lg">
        Explore branch-wise performance, yearly package movement, and placement
        FAQs generated from the visible data so students can read the numbers in
        context.
      </p>
    </header>
  );
}
