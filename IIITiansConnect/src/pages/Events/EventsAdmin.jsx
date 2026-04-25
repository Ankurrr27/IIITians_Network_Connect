import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import EventsHeader from "./Sections/EventsHeader";
import EventsFilters from "./Sections/EventsFilters";
import EventsGrid from "./Sections/EventsGrid";
import AddEventForm from "./Sections/AddEventForm";

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    api
      .get("/events", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: search,
          sortBy: sortBy,
        },
      })
      .then((res) => {
        setEvents(res.data.events);
        setPagination(res.data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage, search, sortBy]);

  const handleSuccess = () => {
    setEditingEvent(null);
    setShowForm(false);
    // Reload events to get updated data
    setLoading(true);
    api
      .get("/events", {
        params: { page: currentPage, limit: itemsPerPage, search, sortBy },
      })
      .then((res) => {
        setEvents(res.data.events);
        setPagination(res.data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((e) => e._id !== id));
    setEditingEvent(null);
    setShowForm(false);
  };

  const totalPages = pagination.totalPages || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,_#eef7ff_0%,_#f7fbff_36%,_#f9fcff_100%)] pb-10 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white/80 text-indigo-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-indigo-700 hover:shadow-md active:scale-95"
              >
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
                <Calendar className="h-4 w-4" />
                Events Workspace
              </div>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Event Management
            </h1>
          </div>
        </div>
        <EventsHeader />

        <EventsFilters
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onCreate={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
        />

        {showForm && (
          <AddEventForm
            editingEvent={editingEvent}
            onSuccess={handleSuccess}
            onDelete={handleDelete}
            onCancel={() => {
              setEditingEvent(null);
              setShowForm(false);
            }}
          />
        )}

        <EventsGrid
          loading={loading}
          events={events}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600"
            >
              Previous
            </button>
            <div className="text-sm font-medium text-slate-400">
              Page <span className="text-slate-900 font-bold">{currentPage}</span> of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
