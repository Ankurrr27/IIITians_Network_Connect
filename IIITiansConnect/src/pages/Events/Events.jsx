import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api/axios";
import { notifyPageEntry } from "../../utils/appNotifications";

import EventsGrid from "./Sections/EventsGrid";
import EventsHeader from "./Sections/EventsHeader";
import EventsFilters from "./Sections/EventsFilters";

export default function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    notifyPageEntry(
      "Congratulations, events page loaded",
      "Fresh events are ready to browse.",
      "page-events-loaded"
    );

    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("PUBLIC EVENTS ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 FILTER + SORT
  const processedEvents = useMemo(() => {
    return [...events]
      .filter((e) => {
        const q = search.toLowerCase();
        return (
          e.title?.toLowerCase().includes(q) ||
          e.collegeName?.toLowerCase().includes(q) ||
          e.clubName?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "az") return a.title.localeCompare(b.title);
        if (sortBy === "za") return b.title.localeCompare(a.title);
        if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
        return new Date(b.date) - new Date(a.date);
      });
  }, [events, search, sortBy]);

  // 📄 PAGINATION LOGIC
  const totalItems = processedEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedEvents = processedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  return (
    <section className="relative min-h-screen bg-[linear-gradient(180deg,_#eff6ff_0%,_#f8faff_40%,_#ffffff_100%)] pb-14 pt-20 sm:pb-16 sm:pt-24">
      {/* Radial Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <EventsHeader />

        <EventsFilters
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          hideCreate // 👈 important (explained below)
        />

        <EventsGrid
          loading={loading}
          events={paginatedEvents}
          isPublic // 👈 important
        />

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
            >
              Previous
            </button>
            <div className="text-sm font-medium text-slate-400">
              Page <span className="text-slate-900 font-bold">{currentPage}</span> of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
