import { Calendar } from "lucide-react";

export default function YearSelector({
  years = [],
  value, // number | null
  onChange,
}) {
  if (!years.length) return null;

  const sortedYears = [...years].sort((a, b) => b - a);
  const latestYear = sortedYears[0];

  return (
    <div
      className="
        flex items-center gap-3
        bg-white border rounded-xl
        px-4 py-2 shadow-sm
        hover:border-indigo-400
        focus-within:ring-2 focus-within:ring-indigo-500
        transition
      "
    >
      {/* Icon */}
      <Calendar size={18} className="text-indigo-600 shrink-0" />

      {/* Label */}
      <span className="text-sm font-medium text-gray-700">
        Year
      </span>

      {/* Select */}
      <select
        value={value === null ? "all" : value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "all" ? null : Number(v));
        }}
        className="
          bg-transparent
          text-sm font-semibold
          text-gray-900
          outline-none
          cursor-pointer
        "
      >
        {/* Latest Year */}
        <option value={latestYear}>
          {latestYear} • Latest
        </option>

        {/* Older Years */}
        {sortedYears
          .filter((y) => y !== latestYear)
          .map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}

        {/* All Years */}
        <option value="all">
          All Years
        </option>
      </select>
    </div>
  );
}
