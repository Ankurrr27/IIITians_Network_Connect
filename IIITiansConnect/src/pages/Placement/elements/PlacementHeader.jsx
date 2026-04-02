export default function PlacementHeader({ collegeName }) {
  return (
    <header className="max-w-3xl space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
        Placement Insights
      </p>

      <h1 className="text-[1.9rem] font-bold leading-[1.08] text-slate-900 sm:text-5xl">
        {collegeName ? `${collegeName} placements` : "Compare IIIT placements"}
      </h1>

      <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-lg sm:leading-7">
        Explore branch-wise performance, yearly package movement, and placement
        FAQs generated from the visible data so students can read the numbers in
        context.
      </p>
    </header>
  );
}
