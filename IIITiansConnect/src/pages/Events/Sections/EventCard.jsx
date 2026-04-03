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
    <div className="h-full w-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(79,70,229,0.14)]">
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
          </div>
        </div>

        <div className="flex min-h-[15rem] flex-col p-4">
          <div className="mb-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700">
              <MapPin size={13} />
              {collegeName || "College"}
            </span>
            {clubName && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 font-medium text-sky-700">
                <Users size={13} />
                {clubName}
              </span>
            )}
          </div>

          <p
            className={`min-h-[4.5rem] text-sm leading-6 text-slate-600 transition-all duration-300 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {description || "No description provided."}
          </p>

          <div className="mt-auto flex items-center gap-2 pt-4">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {expanded ? "Show less" : "View details"}
              <ArrowRight size={14} />
            </button>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open event link"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-200 text-indigo-600 transition hover:bg-indigo-50"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="relative hidden h-full sm:block">
        {isAdmin && (
          <button
            onClick={() => onEdit(event)}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/95 p-2 shadow-sm transition hover:bg-white"
          >
            <Pencil size={16} />
          </button>
        )}

        <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(79,70,229,0.12)]">
          <div className="relative h-[17rem] overflow-hidden">
            <img
              src={banner?.url || "/event-placeholder.jpg"}
              alt={title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

            <div className="absolute left-5 top-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <CalendarDays size={13} />
                {formattedDate}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="max-w-[80%] text-[1.95rem] font-semibold leading-tight">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex min-h-[15.75rem] flex-col px-5 pb-5 pt-4">
            <div className="mb-3 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700">
                <MapPin size={13} />
                {collegeName || "College"}
              </span>
              {clubName && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 font-medium text-sky-700">
                  <Users size={13} />
                  {clubName}
                </span>
              )}
            </div>

            <p
              className={`min-h-[6.5rem] text-[15px] leading-7 text-slate-600 ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {description || "No description provided."}
            </p>

            <div className="mt-auto flex items-center gap-3 pt-5">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="min-w-[11rem] flex-1 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {expanded ? "Hide details" : "View details"}
              </button>

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open event link"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-200 text-indigo-600 transition hover:bg-indigo-50"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
