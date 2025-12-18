import { Search, Loader2 } from "lucide-react";

export default function CollegeSearch({
  value,
  onChange,
  onSelect,
  loading,
  compact = false,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center border rounded-lg px-3 bg-white">
        <Search size={16} className="text-gray-400" />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && onSelect(value)
          }
          placeholder="Search college name"
          className="flex-1 px-3 py-2 text-sm outline-none"
        />

        {loading && (
          <Loader2
            size={16}
            className="animate-spin text-gray-400"
          />
        )}
      </div>
    </div>
  );
}
