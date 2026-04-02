import { Loader2, Search } from "lucide-react";

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
        className={`rounded-[1.15rem] border bg-white transition focus-within:ring-2 focus-within:ring-indigo-500 ${
          compact ? "px-3 py-3 sm:px-3 sm:py-2" : "px-4 py-4 sm:px-4 sm:py-3"
        }`}
      >
        <div className="flex items-center gap-2">
          <Search size={18} className="shrink-0 text-gray-400" />

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search IIIT by name"
            disabled={loading}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !value?.trim()}
          className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:mt-0 sm:w-auto sm:bg-transparent sm:px-0 sm:py-0 sm:text-indigo-600 sm:disabled:bg-transparent"
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
