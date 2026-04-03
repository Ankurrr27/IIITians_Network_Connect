import EventCard from "./EventCard";

export default function EventsGrid({
  loading,
  events,
  onEdit,
  onDelete,
  isPublic = false,
}) {
  if (loading) {
    return <p className="text-gray-500">Loading events...</p>;
  }

  if (events.length === 0) {
    return <p className="text-gray-500">No matching events found.</p>;
  }

  return (
    <div className="grid items-stretch gap-2 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          isAdmin={!isPublic && typeof onEdit === "function"}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
