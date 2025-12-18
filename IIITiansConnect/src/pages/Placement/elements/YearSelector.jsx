import { Calendar } from "lucide-react";

export default function YearSelector({
  years = [],
  value,      // number | null
  onChange,   // (number | null) => void
}) {
  if (!years.length) return null;

  const sortedYears = [...years].sort((a, b) => b - a);
  const latestYear = sortedYears[0];

  return (
    <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2 shadow-sm">
      {/* Icon */}
      <Calendar size={18} className="text-indigo-600" />

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
          text-sm font-medium
          text-gray-900
          outline-none
          cursor-pointer
        "
      >
        {/* Latest first */}
        {sortedYears.map((y) => (
          <option key={y} value={y}>
            {y} {y === latestYear && "• Latest"}
          </option>
        ))}

        {/* Divider-like option */}
        <option disabled>──────────</option>

        {/* All Years */}
        <option value="all">All Years</option>
      </select>
    </div>
  );
}
