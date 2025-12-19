import {
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const EventCard = ({ event, isAdmin = false, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const { title, description, date, banner, collegeName, clubName, link } =
    event;

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className="
        bg-white border
        rounded-lg sm:rounded-2xl
        overflow-hidden
        transition hover:shadow-lg
        w-full
      "
    >
      {/* ================= MOBILE LAYOUT ================= */}
      <div className="flex sm:hidden h-24 rounded-lg overflow-hidden">
        {/* IMAGE */}
        <div className="relative w-[60%] bg-gray-200">
          <img
            src={banner?.url || "/event-placeholder.jpg"}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* WHITE GRADIENT OVERLAY */}
          <div className="absolute inset-y-0 right-0 w-10 white" />
        </div>

        {/* CONTENT */}
        <div className="relative w-[40%] p-2 bg-white">
          <h3 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">
            {title}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
            <CalendarDays size={10} />
            {formattedDate}
          </div>

          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500">
            <MapPin size={10} />
            {collegeName || "College"}
          </div>

          <button
            onClick={() => setExpanded(true)}
            className="
              absolute bottom-1 right-2
              text-[10px] font-medium
              text-indigo-600
            "
          >
            Details →
          </button>
        </div>
      </div>

      {/* ================= MOBILE EXPANDED ================= */}
      {expanded && (
        <div className="sm:hidden border-t p-3 bg-white">
          <p className="text-xs text-gray-600 leading-relaxed">
            {description || "No description provided."}
          </p>

          <div className="mt-3 space-y-1 text-xs text-gray-500">
            {clubName && (
              <div className="flex items-center gap-2">
                <Users size={12} />
                {clubName}
              </div>
            )}
          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-indigo-600"
            >
              <ExternalLink size={12} />
              Open Event
            </a>
          )}

          <button
            onClick={() => setExpanded(false)}
            className="mt-3 w-full text-xs border border-indigo-600 text-indigo-600 rounded-md py-1.5"
          >
            Close
          </button>
        </div>
      )}

      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="hidden sm:block relative">
        {/* ADMIN EDIT */}
        {isAdmin && (
          <button
            onClick={() => onEdit(event)}
            className="
              absolute top-3 right-3 z-10
              bg-white border rounded-full
              p-2 hover:bg-gray-100
            "
          >
            <Pencil size={16} />
          </button>
        )}

        {/* BANNER */}
        <div className="h-44 bg-gray-200 overflow-hidden">
          <img
            src={banner?.url || "/event-placeholder.jpg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          <p
            className={`text-sm text-gray-600 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {description || "No description provided."}
          </p>

          <div className="space-y-2 text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              {formattedDate}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {collegeName || "College not specified"}
            </div>

            {clubName && (
              <div className="flex items-center gap-2">
                <Users size={16} />
                {clubName}
              </div>
            )}
          </div>

          {expanded && link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
            >
              <ExternalLink size={14} />
              Open Event Link
            </a>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="
              mt-4 w-full
              border border-indigo-600 text-indigo-600
              rounded-lg py-2
              hover:bg-indigo-600 hover:text-white
              transition
            "
          >
            {expanded ? "Hide Details" : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
