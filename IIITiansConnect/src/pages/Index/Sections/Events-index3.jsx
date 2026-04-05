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
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-56 bg-slate-200" />
                <div className="space-y-4 p-5">
                  <div className="flex gap-2">
                    <div className="h-8 w-24 rounded-full bg-slate-200" />
                    <div className="h-8 w-20 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-7 w-3/4 rounded-xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-5/6 rounded bg-slate-100" />
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                  </div>
                  <div className="h-12 rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
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
