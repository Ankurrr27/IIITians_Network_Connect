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
        className={`rounded-[1rem] border border-slate-200 bg-white transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/20 ${
          compact ? "px-3 py-2.5 sm:px-3 sm:py-2.5" : "px-3 py-3 sm:px-4 sm:py-3"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Search size={18} className="shrink-0 text-gray-400" />

            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search IIIT by name"
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !value?.trim()}
            className="inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-auto"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
