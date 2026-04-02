import { Calendar } from "lucide-react";

export default function YearSelector({ years = [], value, onChange }) {
  if (!years.length) return null;

  const sortedYears = [...years].sort((a, b) => b - a);
  const latestYear = sortedYears[0];

  return (
    <div className="w-full rounded-[1.15rem] border bg-white p-3 shadow-sm transition hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500 sm:w-auto sm:px-4 sm:py-2">
      <div className="flex items-center gap-2">
        <Calendar size={18} className="shrink-0 text-indigo-600" />
        <span className="text-xs font-medium text-gray-700 sm:text-sm">
          Year
        </span>
      </div>

      <select
        value={value === null ? "all" : value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "all" ? null : Number(v));
        }}
        className="mt-2 w-full cursor-pointer bg-transparent py-1 text-sm font-semibold text-gray-900 outline-none sm:mt-0 sm:w-auto"
      >
        <option value={latestYear}>{latestYear} - Latest</option>

        {sortedYears
          .filter((y) => y !== latestYear)
          .map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}

        <option value="all">All Years</option>
      </select>
    </div>
  );
}
