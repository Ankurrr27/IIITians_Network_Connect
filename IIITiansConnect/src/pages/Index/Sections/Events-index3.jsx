import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import EventCard from "../../Events/Sections/EventCard";

const EventsPreview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const LIMIT = 6;

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const visibleEvents = events.slice(0, LIMIT);

  return (
    <section className="bg-white py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Latest Highlights
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Events
            </h2>
          </div>

          <button
            onClick={() => navigate("/events")}
            className="rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            View more
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events available.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <EventCard key={event._id} event={event} isAdmin={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPreview;
