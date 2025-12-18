import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";

import EventsHeader from "./Sections/EventsHeader";
import EventsFilters from "./Sections/EventsFilters";
import EventsGrid from "./Sections/EventsGrid";
import AddEventForm from "../../ui/AddEventForm";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSuccess = (event) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e._id === event._id);
      return exists
        ? prev.map((e) => (e._id === event._id ? event : e))
        : [event, ...prev];
    });
    setEditingEvent(null);
    setShowForm(false);
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
        return new Date(b.date) - new Date(a.date); // newest
      });
  }, [events, search, sortBy]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
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
          events={processedEvents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}
