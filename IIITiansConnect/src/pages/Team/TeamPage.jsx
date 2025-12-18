import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";

import TeamGrid from "./Components/TeamGrid.jsx";
import TeamCTA from "./TeamCTA.jsx";

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("ALL");
  const [role, setRole] = useState("ALL");

  useEffect(() => {
    api
      .get("/team")
      .then((res) => setMembers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 derive years dynamically
  const years = useMemo(() => {
    const set = new Set(members.map((m) => m.year).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [members]);

  // 🔹 filter members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.role?.toLowerCase().includes(search.toLowerCase()) ||
        m.iiit?.toLowerCase().includes(search.toLowerCase());

      const matchesYear = year === "ALL" || m.year === year;
      const matchesRole = role === "ALL" || m.roleType === role;

      return matchesSearch && matchesYear && matchesRole;
    });
  }, [members, search, year, role]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-10 text-center">
        <h1 className="text-4xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Meet the Team
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-gray-600 text-base md:text-lg">
          The people driving vision, execution, and impact across the IIITians
          Network.
        </p>
      </section>

      {/* SEARCH + YEAR FILTER */}
      <section className="max-w-7xl mx-auto px-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search by name, role or IIIT"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2.5 rounded-xl border bg-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y === "ALL" ? "All Years" : y}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ROLE FILTER (TEAM MATES) */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-3">
          {[
            { label: "All", value: "ALL" },
            { label: "Executives", value: "EXEC" },
            { label: "Leads", value: "LEAD" },
            { label: "Team", value: "MEMBER" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setRole(item.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border transition
                ${
                  role === item.value
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <SkeletonGrid />
        ) : filteredMembers.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No matching team members found.
          </p>
        ) : (
          <>
            <TeamGrid members={filteredMembers} />
            <TeamCTA />
          </>
        )}
      </section>
    </div>
  );
}

/* ---------------- Skeleton Loader ---------------- */

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border bg-white p-4"
        >
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
