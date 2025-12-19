export default function EventsFilters({
  search,
  setSearch,
  sortBy,
  setSortBy,
  onCreate,
}) {
  return (
    <div className="
      flex flex-col gap-2 sm:gap-4 mb-10
      md:flex-row md:items-center md:justify-between
    ">
      {/* Filters */}
      <div className="
        flex flex-col gap-3
        sm:flex-row sm:flex-wrap
      ">
        <input
          type="text"
          placeholder="Search events, college, club..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full sm:w-64
            border rounded-lg px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="
            w-full sm:w-auto
            border rounded-lg px-3 py-2 bg-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
        </select>
      </div>

      {/* CTA */}
      <button
        onClick={onCreate}
        className="
          w-full md:w-auto
          bg-indigo-600 text-white
          px-4 py-2 rounded-lg
          hover:bg-indigo-700 transition
        "
      >
        Create Event
      </button>
    </div>
  );
}
