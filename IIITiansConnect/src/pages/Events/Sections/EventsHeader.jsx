import { ArrowUpRight, BookOpenText, CalendarDays, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventsHeader() {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Events Desk
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Explore the latest network events.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Discover cultural festivals, club launches, collaborations, and verified
            event pushes from IIIT communities across the network.
          </p>
        </div>

        <div className="w-full lg:max-w-lg rounded-[1.8rem] border border-white/60 bg-white/70 p-5 shadow-[0_18px_44px_-30px_rgba(79,70,229,0.2)] backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                <BookOpenText className="h-3.5 w-3.5" />
                Need help?
              </div>
              <div className="text-lg font-bold text-slate-900">
                Learn how event pushes work
              </div>
              <p className="max-w-xs text-xs leading-5 text-slate-500">
                See how a club announcement becomes a verified event and gets listed here.
              </p>
            </div>
            
            <Link
              to="/guide?flow=event"
              className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-500 sm:shrink-0"
            >
              Open event guide
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-indigo-50/50 px-3 py-2.5 text-[11px] font-medium text-indigo-700">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>Discuss event pushes can appear here after approval</span>
          </div>
        </div>
      </div>
    </div>
  );
}
