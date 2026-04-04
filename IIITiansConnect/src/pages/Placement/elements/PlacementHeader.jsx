import { Building2 } from "lucide-react";

export default function PlacementHeader({ collegeName }) {
  return (
    <header className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
        <Building2 className="h-4 w-4" />
        Placement Insights
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        {collegeName ? `${collegeName} placements` : "Compare IIIT placements"}
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Explore branch-wise performance, yearly package movement, and placement
        FAQs generated from the visible data so students can read the numbers in
        context.
      </p>
    </header>
  );
}
