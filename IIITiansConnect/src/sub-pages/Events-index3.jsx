import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import EventCard from "../ui/EventCard";

const Index2_2 = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const LIMIT = 3;

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const visibleEvents = events.slice(0, LIMIT);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-extrabold">Events</h2>

          {/* VIEW MORE LINK */}
          <button
            onClick={() => navigate("/events")}
            className="
              text-indigo-600 font-medium
              hover:underline
            "
          >
            View More →
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isAdmin={false}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Index2_2;
