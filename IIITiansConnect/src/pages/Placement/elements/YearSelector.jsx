import { Calendar } from "lucide-react";

export default function YearSelector({
  years = [],
  value,
  onChange,
}) {
  if (!years.length) return null;

  const sortedYears = [...years].sort((a, b) => b - a);
  const latestYear = sortedYears[0];

  return (
    <div
      className="
        bg-white border rounded-xl shadow-sm
        hover:border-indigo-400 transition
        focus-within:ring-2 focus-within:ring-indigo-500
        p-3 sm:px-4 sm:py-2
        flex flex-col sm:flex-row
        gap-2 sm:gap-3
        w-full sm:w-auto
      "
    >
      {/* Header (mobile) */}
      <div className="flex items-center gap-2">
        <Calendar
          size={18}
          className="text-indigo-600 shrink-0"
        />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          Year
        </span>
      </div>

      {/* Select */}
      <select
        value={value === null ? "all" : value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "all" ? null : Number(v));
        }}
        className="
          w-full sm:w-auto
          bg-transparent
          text-sm sm:text-sm font-semibold
          text-gray-900
          outline-none
          cursor-pointer
          py-1 sm:py-0
        "
      >
        <option value={latestYear}>
          {latestYear} • Latest
        </option>

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
