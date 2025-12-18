export default function EventsFilters({
  search,
  setSearch,
  sortBy,
  setSortBy,
  onCreate,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search events, college, club..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
        </select>
      </div>

      <button
        onClick={onCreate}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        Create Event
      </button>
    </div>
  );
}
