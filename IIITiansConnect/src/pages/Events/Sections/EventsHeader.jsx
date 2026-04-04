import { ArrowUpRight, BookOpenText, CalendarDays, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventsHeader() {
  return (
    <div className="mb-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Events Desk
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Explore the latest network events.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Discover cultural festivals, club launches, collaborations, and verified
            event pushes from IIIT communities across the network.
          </p>
        </div>

        <div className="rounded-[1.5rem] bg-white/90 p-4 shadow-[0_18px_44px_-30px_rgba(79,70,229,0.2)]">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
            <BookOpenText className="h-4 w-4" />
            Need help?
          </div>
          <div className="mt-3 text-base font-semibold text-slate-900">
            Learn how event pushes work
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            See how a club announcement becomes a verified event and gets listed here.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/guide?flow=event"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Open event guide
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">
              <CalendarDays className="h-4 w-4" />
              Discuss event pushes can appear here after approval
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
