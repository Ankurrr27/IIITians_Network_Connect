import { TrendingUp } from "lucide-react";

export default function PlacementHeader() {
  return (
    <header className="space-y-2">
      {/* <div className="flex items-center gap-3 text-indigo-600">
        <TrendingUp size={28} />
        <span className="text-sm font-semibold uppercase tracking-wide">
          Placement Analytics
        </span>
      </div> */}

      <h1 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight mt-14 pt-5">
        Placement Insights
      </h1>
      

      <p className="text-gray-600 max-w-3xl text-lg">
        Explore branch-wise placement performance, trends, and
        outcomes across IIITs — designed to help you understand
        the bigger picture, not just numbers.
      </p>
    </header>
  );
}
