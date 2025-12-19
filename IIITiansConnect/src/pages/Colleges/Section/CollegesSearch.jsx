import { useState, useRef, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";

export default function CollegesSearch({ search, setSearch, setFilter }) {
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

  return (
    <div className="relative mx-auto mb-6 sm:mb-12 max-w-full sm:max-w-md px-3 sm:px-0">
      <div className="relative flex items-center">
        {/* SEARCH ICON */}
        <Search
          size={16}
          className="absolute left-3 text-gray-400"
        />

        {/* INPUT */}
        <input
          type="text"
          placeholder="Search IIIT by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-9 pr-12
            py-2.5 sm:py-2
            text-sm sm:text-base
            border rounded-xl
            focus:outline-none
            focus:ring-2 focus:ring-indigo-500
          "
        />

        {/* MENU */}
        <div ref={menuRef} className="absolute right-2">
          <button
            onClick={() => setOpenMenu((p) => !p)}
            className="
              p-2 sm:p-1.5
              rounded-lg
              hover:bg-gray-100
              focus:outline-none
            "
          >
            <MoreVertical size={18} />
          </button>

          {openMenu && (
            <div
              className="
                absolute right-0 mt-2
                w-44 sm:w-40
                bg-white border
                rounded-lg shadow-lg
                z-10
                text-sm
              "
            >
              {[
                ["AZ", "Sort A–Z"],
                ["ZA", "Sort Z–A"],
                ["WEBSITE", "Has Website"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setFilter(value);
                    setOpenMenu(false);
                  }}
                  className="
                    w-full text-left
                    px-4 py-2
                    hover:bg-gray-100
                  "
                >
                  {label}
                </button>
              ))}

              <button
                onClick={() => {
                  setFilter("NONE");
                  setOpenMenu(false);
                }}
                className="
                  w-full text-left
                  px-4 py-2
                  text-red-500
                  hover:bg-gray-100
                "
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
