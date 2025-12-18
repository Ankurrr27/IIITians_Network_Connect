import { Search, Loader2 } from "lucide-react";

export default function CollegeSearch({
  value,
  onChange,
  onSelect,
  loading = false,
  compact = false,
}) {
  const handleSearch = () => {
    if (!value?.trim() || loading) return;
    onSelect(value.trim());
  };

  return (
    <div className={`w-full ${compact ? "" : "space-y-2"}`}>
      <div
        className={`
          flex items-center gap-2
          border rounded-xl bg-white
          transition focus-within:ring-2 focus-within:ring-indigo-500
          ${compact ? "px-3 py-2" : "px-4 py-3"}
        `}
      >
        <Search size={18} className="text-gray-400 shrink-0" />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search IIIT by name (e.g. IIIT Hyderabad)"
          disabled={loading}
          className="
            flex-1 bg-transparent text-xs
            outline-none placeholder:text-gray-400
            disabled:cursor-not-allowed
          "
        />

        <button
          onClick={handleSearch}
          disabled={loading || !value?.trim()}
          className="
            flex items-center gap-1
            text-sm font-medium text-indigo-600
            disabled:text-gray-400 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Search"
          )}
        </button>
      </div>

      
    </div>
  );
}
