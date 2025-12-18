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
    <div className="max-w-md mx-auto mb-12 relative flex items-center">
      <Search size={18} className="absolute left-3 text-gray-400" />

      <input
        type="text"
        placeholder="Search IIIT by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-12 py-2 border rounded-xl text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div ref={menuRef} className="absolute right-2">
        <button
          onClick={() => setOpenMenu((p) => !p)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <MoreVertical size={18} />
        </button>

        {openMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10 text-sm">
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
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                {label}
              </button>
            ))}

            <button
              onClick={() => {
                setFilter("NONE");
                setOpenMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
