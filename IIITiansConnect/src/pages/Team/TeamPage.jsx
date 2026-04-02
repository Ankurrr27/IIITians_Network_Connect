import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import api from "../../api/axios";

import TeamGrid from "./Components/TeamGrid.jsx";
import TeamCTA from "./TeamCTA.jsx";

const roleFilters = [
  { label: "All", value: "ALL" },
  { label: "Executives", value: "EXEC" },
  { label: "Leads", value: "LEAD" },
  { label: "Team", value: "MEMBER" },
];

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const years = useMemo(() => {
    const values = new Set(members.map((member) => member.year).filter(Boolean));
    const sortedYears = Array.from(values).sort((a, b) =>
      String(b).localeCompare(String(a), undefined, { numeric: true })
    );
    return ["ALL", ...sortedYears];
  }, [members]);

  useEffect(() => {
    if (year === "ALL" && years.length > 1) {
      setYear(years[1]);
    }
  }, [years, year]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        member.name?.toLowerCase().includes(normalizedSearch) ||
        member.role?.toLowerCase().includes(normalizedSearch) ||
        member.iiit?.toLowerCase().includes(normalizedSearch);

      const matchesYear = year === "ALL" || member.year === year;
      const matchesRole = role === "ALL" || member.roleType === role;

      return matchesSearch && matchesYear && matchesRole;
    });
  }, [members, search, year, role]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-28">
        <div className="rounded-[2rem] border border-indigo-100 bg-white/90 px-6 py-10 shadow-[0_24px_80px_rgba(99,102,241,0.08)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
            <Users className="h-4 w-4" />
            Team Directory
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Meet the Team
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            The people driving vision, execution, and impact across the IIITians
            Network.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-3xl font-semibold text-slate-900">
                {members.length}
              </div>
              <div className="mt-1 text-sm text-slate-600">Visible members</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-3xl font-semibold text-slate-900">
                {years.length > 1 ? years.length - 1 : 0}
              </div>
              <div className="mt-1 text-sm text-slate-600">Active batches</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-3xl font-semibold text-slate-900">
                {filteredMembers.length}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Matching current filters
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, role or IIIT"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option === "ALL" ? "All Years" : option}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                {roleFilters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      role === item.value
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24">
        {loading ? (
          <SkeletonGrid />
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-20 text-center text-slate-500 shadow-sm">
            No matching team members found.
          </div>
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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="mb-4 aspect-[3/4] rounded-xl bg-slate-200" />
          <div className="mb-2 h-3 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
