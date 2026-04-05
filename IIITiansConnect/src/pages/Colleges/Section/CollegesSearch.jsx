import { useState, useRef, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";

export default function CollegesSearch({
  search,
  setSearch,
  setFilter,
  hasRecentSearches = false,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sortOptions = [
    ["AZ", "Sort A-Z"],
    ["ZA", "Sort Z-A"],
    ["WEBSITE", "Has Website"],
    ...(hasRecentSearches ? [["RECENT", "Recently Searched"]] : []),
  ];

  return (
    <div className="relative mx-auto mb-6 max-w-full px-3 sm:mb-12 sm:max-w-md sm:px-0">
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3 text-gray-400" />

        <input
          type="text"
          placeholder="Search IIIT by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border py-2.5 pl-9 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-base"
        />

        <div ref={menuRef} className="absolute right-2">
          <button
            onClick={() => setOpenMenu((p) => !p)}
            className="rounded-lg p-2 hover:bg-gray-100 focus:outline-none sm:p-1.5"
          >
            <MoreVertical size={18} />
          </button>

          {openMenu && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border bg-white text-sm shadow-lg sm:w-40">
              {sortOptions.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setFilter(value);
                    setOpenMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {label}
                </button>
              ))}

              <button
                onClick={() => {
                  setFilter("NONE");
                  setOpenMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
