import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

export default function LegacyFiltersSection({
  isDarkMode,
  search,
  setSearch,
  areFiltersOpen,
  setAreFiltersOpen,
  generationFilter,
  setGenerationFilter,
  iiitFilter,
  setIiitFilter,
  professionalStatusFilter,
  setProfessionalStatusFilter,
  legacyTypeFilter,
  setLegacyTypeFilter,
  networkPostFilter,
  setNetworkPostFilter,
  generationOptions,
  iiitOptions,
  networkPostOptions,
  filterSelectClass,
}) {
  return (
    <div>
      <div className="max-w-2xl px-1 pb-4 sm:px-0 sm:pb-5">
        <h2
          className={`text-xl font-semibold sm:text-2xl ${
            isDarkMode ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Search Network Legacy
        </h2>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Filter by name, batch, network post, professional role, company, or
          institute.
        </p>
      </div>

      <div className="p-0 sm:p-1">
        <div className="flex items-center gap-3">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try: Ankur, Vice President, Adobe, CSE, or IIIT Surat"
              className={`w-full rounded-2xl border px-11 py-3 text-sm outline-none transition duration-300 placeholder:text-slate-500 sm:text-base ${
                isDarkMode
                  ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  : "border-slate-200 bg-white/90 text-slate-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              }`}
            />
          </label>

          <button
            type="button"
            onClick={() => setAreFiltersOpen((prev) => !prev)}
            className={`inline-flex h-[3.15rem] w-[3.15rem] flex-shrink-0 items-center justify-center rounded-2xl border transition sm:w-auto sm:gap-2 sm:px-4 ${
              isDarkMode
                ? "border-slate-700 bg-slate-950 text-slate-100"
                : "border-slate-200 bg-white text-slate-700 shadow-sm"
            }`}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4.5 w-4.5" />
            <span className="hidden text-sm font-semibold sm:inline">Filters</span>
          </button>
        </div>

        <div
          className={`${areFiltersOpen ? "mt-4 grid" : "hidden"} gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]`}
        >
          <div className="relative">
            <select
              value={generationFilter}
              onChange={(event) => setGenerationFilter(event.target.value)}
              title={generationFilter || "All generations"}
              className={filterSelectClass}
            >
              <option value="">All generations</option>
              {generationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={iiitFilter}
              onChange={(event) => setIiitFilter(event.target.value)}
              title={iiitFilter || "All institutes"}
              className={filterSelectClass}
            >
              <option value="">All institutes</option>
              {iiitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={professionalStatusFilter}
              onChange={(event) => setProfessionalStatusFilter(event.target.value)}
              title={
                professionalStatusFilter === "working"
                  ? "Working professionals"
                  : professionalStatusFilter === "open"
                    ? "Open to next move"
                    : "All professional stages"
              }
              className={filterSelectClass}
            >
              <option value="">All professional stages</option>
              <option value="working">Working professionals</option>
              <option value="open">Open to next move</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={legacyTypeFilter}
              onChange={(event) => setLegacyTypeFilter(event.target.value)}
              title={
                legacyTypeFilter === "team_member"
                  ? "Team members"
                  : legacyTypeFilter === "alumni"
                    ? "Submitted alumni"
                    : "All legacy types"
              }
              className={filterSelectClass}
            >
              <option value="">All legacy types</option>
              <option value="team_member">Team members</option>
              <option value="alumni">Submitted alumni</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={networkPostFilter}
              onChange={(event) => setNetworkPostFilter(event.target.value)}
              title={networkPostFilter || "All network posts"}
              className={filterSelectClass}
            >
              <option value="">All network posts</option>
              {networkPostOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setGenerationFilter("");
              setIiitFilter("");
              setProfessionalStatusFilter("");
              setLegacyTypeFilter("");
              setNetworkPostFilter("");
            }}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 sm:text-base ${
              isDarkMode
                ? "border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-900"
                : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md"
            }`}
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
