import EventCard from "./EventCard";

export default function EventsGrid({
  loading,
  events,
  onEdit,
  onDelete,
  isPublic = false,
}) {
  if (loading) {
    return (
      <div className="grid items-stretch gap-2 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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
              <div className="h-4 w-1/2 rounded bg-slate-100" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="h-4 w-2/3 rounded bg-slate-100" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-12 flex-1 rounded-full bg-slate-200" />
                <div className="h-12 w-12 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
