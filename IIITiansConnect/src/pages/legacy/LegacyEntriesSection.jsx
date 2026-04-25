import {
  Briefcase,
  Building2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Milestone,
  ShieldCheck,
} from "lucide-react";
import { cardShell } from "./constants.js";
import { getLegacyEntryViewModel } from "./utils.js";

function LegacyEntrySkeleton({ isDarkMode }) {
  return (
    <div
      className={`animate-pulse overflow-hidden rounded-[1.5rem] border sm:rounded-[2rem] ${
        isDarkMode ? cardShell.dark : cardShell.light
      }`}
    >
      <div className="flex flex-col lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="h-64 bg-slate-200 sm:h-72 lg:h-[22rem]" />
        <div className="space-y-5 p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-10 w-2/3 rounded-2xl bg-slate-200" />
              <div className="flex flex-wrap gap-2">
                <div className="h-9 w-28 rounded-full bg-slate-100" />
                <div className="h-9 w-24 rounded-full bg-slate-100" />
                <div className="h-9 w-32 rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="h-24 w-full rounded-[1.4rem] bg-slate-100 md:w-52" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="h-8 w-40 rounded-full bg-white" />
              <div className="h-8 w-36 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-5 w-16 rounded bg-slate-100" />
            <div className="h-5 w-20 rounded bg-slate-100" />
            <div className="h-5 w-20 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegacyEntryCard({ entry, isDarkMode }) {
  const {
    companyValue,
    showRoleChip,
    showCompanyChip,
    dedupedRoleHistory,
    totalTerms,
  } = getLegacyEntryViewModel(entry);

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.75rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(99,102,241,0.15)] sm:rounded-[2.25rem] ${
        isDarkMode 
          ? "border-slate-800 bg-slate-900/60 backdrop-blur-md" 
          : "border-indigo-100 bg-white shadow-[0_15px_45px_rgba(148,163,184,0.08)]"
      }`}
    >
      <div className="flex flex-col lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        {entry.photo?.url ? (
          <div className="relative h-64 overflow-hidden sm:h-72 lg:h-full">
            <img
              src={entry.photo.url}
              alt={entry.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" />
            <div className="absolute left-4 top-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md ${
                isDarkMode ? "bg-slate-950/80 text-indigo-400" : "bg-white/90 text-indigo-700 shadow-sm"
              }`}>
                {entry.generation}
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`flex min-h-[16rem] items-end p-6 sm:min-h-[18rem] lg:min-h-full ${
              isDarkMode
                ? "bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent),linear-gradient(to_bottom_right,rgba(15,23,42,1),rgba(30,41,59,1))]"
                : "bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.1),transparent),linear-gradient(to_bottom_right,rgba(238,242,255,1),rgba(255,255,255,1))]"
            }`}
          >
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700 shadow-sm">
              {entry.generation}
            </span>
          </div>
        )}

        <div className="flex flex-col p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h3
                  className={`text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2.25rem] ${
                    isDarkMode ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  {entry.name}
                </h3>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {entry.networkPost && (
                  <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ${
                    isDarkMode 
                      ? "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20" 
                      : "bg-indigo-50 text-indigo-700 ring-indigo-100"
                  }`}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {entry.networkPost}
                  </span>
                )}

                {showRoleChip && (
                  <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ${
                    isDarkMode 
                      ? "bg-slate-800 text-slate-300 ring-slate-700" 
                      : "bg-slate-50 text-slate-700 ring-slate-200"
                  }`}>
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    {entry.currentRole}
                  </span>
                )}

                {showCompanyChip && (
                  <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ${
                    isDarkMode 
                      ? "bg-slate-800 text-slate-300 ring-slate-700" 
                      : "bg-slate-50 text-slate-700 ring-slate-200"
                  }`}>
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {companyValue}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`relative overflow-hidden rounded-[1.5rem] border p-4 sm:min-w-[14rem] ${
                isDarkMode 
                  ? "border-slate-700/50 bg-slate-800/40 text-slate-300" 
                  : "border-indigo-50 bg-indigo-50/40 text-indigo-900"
              }`}
            >
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500/80">
                  <Building2 className="h-3 w-3" />
                  {entry.iiit}
                </div>
                <div className="text-sm font-semibold">{entry.branch}</div>
                <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                  <Milestone className="h-3 w-3" />
                  {entry.legacyType === "team_member"
                    ? `Served ${totalTerms} ${totalTerms > 1 ? "terms" : "term"}`
                    : `Class of ${entry.graduationYear}`}
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-16 w-16 opacity-[0.03]">
                <ShieldCheck className="h-full w-full" />
              </div>
            </div>
          </div>

          {entry.bio && (
            <p
              className={`mt-6 text-sm leading-relaxed sm:text-[15px] lg:max-w-4xl ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {entry.bio}
            </p>
          )}

          {dedupedRoleHistory.length > 0 && (
            <div
              className={`mt-6 rounded-[1.5rem] border p-4 transition-colors ${
                isDarkMode
                  ? "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                  : "border-slate-200/60 bg-slate-50/50 hover:border-slate-300/60"
              }`}
            >
              <div
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                Network Journey
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {dedupedRoleHistory.map((item, index) => (
                  <div
                    key={`${item.year}-${item.team}-${item.role}-${index}`}
                    className={`rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all hover:scale-[1.02] ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                        : "border-white bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/50 hover:ring-indigo-200"
                    }`}
                  >
                    <span className="text-indigo-500">{item.year ? `${item.year}: ` : ""}</span>
                    {item.role}
                    {item.team ? <span className="opacity-60"> ({item.team})</span> : ""}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6">
            <div className="flex flex-wrap items-center gap-6">
              <a
                href={`mailto:${entry.email}`}
                className="group flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-slate-100 group-hover:bg-indigo-50"}`}>
                  <Mail className="h-4 w-4" />
                </div>
                Email
              </a>

              {entry.linkedin && (
                <a
                  href={entry.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-slate-100 group-hover:bg-indigo-50"}`}>
                    <Linkedin className="h-4 w-4" />
                  </div>
                  LinkedIn
                </a>
              )}

              {entry.instagram && (
                <a
                  href={entry.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-slate-100 group-hover:bg-indigo-50"}`}>
                    <Instagram className="h-4 w-4" />
                  </div>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LegacyEntriesSection({ isDarkMode, loading, entries }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <LegacyEntrySkeleton key={index} isDarkMode={isDarkMode} />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        className={`rounded-[1.5rem] border border-dashed p-6 text-center sm:rounded-[2rem] sm:p-8 ${
          isDarkMode
            ? "border-slate-700 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
            : "border-slate-300 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
        }`}
      >
        <h3
          className={`text-lg font-semibold sm:text-xl ${
            isDarkMode ? "text-slate-100" : "text-slate-900"
          }`}
        >
          No legacy profiles match this search yet
        </h3>
        <p
          className={`mt-2 text-sm leading-7 ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Try another search term or open the form above to submit a new profile
          request.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {entries.map((entry) => (
        <LegacyEntryCard key={entry._id} entry={entry} isDarkMode={isDarkMode} />
      ))}
    </div>
  );
}
