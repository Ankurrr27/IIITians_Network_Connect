import { ArrowUpDown, Plus, Search } from "lucide-react";

export default function EventsFilters({
  search,
  setSearch,
  sortBy,
  setSortBy,
  onCreate,
  hideCreate = false,
}) {
  return (
    <div className="mb-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem_auto] lg:items-center">
        <label className="flex items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-indigo-400 focus-within:bg-white">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, colleges, clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <label className="flex items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-indigo-400 focus-within:bg-white">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Title A-Z</option>
            <option value="za">Title Z-A</option>
          </select>
        </label>

        {!hideCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Create event
          </button>
        )}
      </div>
    </div>
  );
}
