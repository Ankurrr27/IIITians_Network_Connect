import {
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  ExternalLink,
  ArrowRight,
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
    <div className="w-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(79,70,229,0.14)]">
      <div className="sm:hidden">
        <div className="relative h-44 overflow-hidden">
          <img
            src={banner?.url || "/event-placeholder.jpg"}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

          {isAdmin && (
            <button
              onClick={() => onEdit(event)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-slate-700 shadow-sm"
            >
              <Pencil size={16} />
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur">
              <CalendarDays size={12} />
              {formattedDate}
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-tight">{title}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/90">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 backdrop-blur">
                <MapPin size={12} />
                {collegeName || "College"}
              </span>
              {clubName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 backdrop-blur">
                  <Users size={12} />
                  {clubName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <p
            className={`text-sm leading-6 text-slate-600 transition-all duration-300 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {description || "No description provided."}
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {expanded ? "Show less" : "View details"}
              <ArrowRight size={14} />
            </button>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                <ExternalLink size={14} />
                Open Event
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="hidden sm:block relative">
        {isAdmin && (
          <button
            onClick={() => onEdit(event)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/95 p-2 shadow-sm transition hover:bg-white"
          >
            <Pencil size={16} />
          </button>
        )}

        <div className="relative h-48 overflow-hidden">
          <img
            src={banner?.url || "/event-placeholder.jpg"}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            <span>{formattedDate}</span>
            <span className="h-1 w-1 rounded-full bg-indigo-300" />
            <span>{collegeName || "College not specified"}</span>
          </div>

          <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3>

          <p
            className={`mt-3 text-sm leading-7 text-slate-600 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {description || "No description provided."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              <CalendarDays size={14} />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              <MapPin size={14} />
              {collegeName || "College"}
            </span>
            {clubName && (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <Users size={14} />
                {clubName}
              </span>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex-1 rounded-full border border-indigo-600 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
            >
              {expanded ? "Hide details" : "View details"}
            </button>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <ExternalLink size={14} />
                Open
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
