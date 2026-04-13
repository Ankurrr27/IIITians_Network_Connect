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
    locationValue,
    showRoleChip,
    showCompanyChip,
    showLocationChip,
    dedupedRoleHistory,
  } = getLegacyEntryViewModel(entry);

  return (
    <article
      className={`overflow-hidden rounded-[1.5rem] border transition sm:rounded-[2rem] ${
        isDarkMode ? cardShell.dark : cardShell.light
      }`}
    >
      <div className="flex flex-col lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        {entry.photo?.url ? (
          <div className="relative h-64 overflow-hidden sm:h-72 lg:h-[22rem]">
            <img
              src={entry.photo.url}
              alt={entry.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700 backdrop-blur sm:text-xs">
                {entry.generation}
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`flex min-h-[16rem] items-end p-5 sm:min-h-[18rem] lg:min-h-[22rem] ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950"
                : "bg-gradient-to-br from-indigo-100 via-indigo-50 to-white"
            }`}
          >
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700 shadow-sm sm:text-xs">
              {entry.generation}
            </span>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h3
                className={`text-2xl font-semibold sm:text-[2rem] ${
                  isDarkMode ? "text-slate-100" : "text-slate-900"
                }`}
              >
                {entry.name}
              </h3>

              <div
                className={`mt-3 flex flex-wrap gap-2 text-sm ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {entry.networkPost && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                      isDarkMode ? "bg-slate-800" : "bg-indigo-50"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    {entry.networkPost}
                  </span>
                )}

                {showRoleChip && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                      isDarkMode ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  >
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    {entry.currentRole}
                  </span>
                )}

                {showCompanyChip && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                      isDarkMode ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  >
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    {companyValue}
                  </span>
                )}

                {showLocationChip && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                      isDarkMode ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    {locationValue}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`rounded-[1.4rem] px-4 py-3 text-sm sm:min-w-[13rem] max-sm:bg-transparent max-sm:px-0 max-sm:py-0 ${
                isDarkMode ? "bg-slate-800 text-indigo-200" : "bg-indigo-50 text-indigo-900"
              }`}
            >
              <div className="font-semibold">{entry.iiit}</div>
              <div>{entry.branch}</div>
              <div>
                {entry.legacyType === "team_member"
                  ? `Team term ${entry.generation}`
                  : `Class of ${entry.graduationYear}`}
              </div>
            </div>
          </div>

          {entry.bio && (
            <p
              className={`mt-5 text-sm leading-7 sm:text-[15px] ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {entry.bio}
            </p>
          )}

          {dedupedRoleHistory.length > 0 && (
            <div
              className={`mt-5 rounded-[1.5rem] border p-3 sm:p-4 max-sm:border-slate-200/70 max-sm:bg-white/60 ${
                isDarkMode
                  ? "border-slate-800 bg-slate-950/50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <Milestone className="h-4 w-4 text-indigo-600" />
                Network Journey
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {dedupedRoleHistory.map((item, index) => (
                  <div
                    key={`${item.year}-${item.team}-${item.role}-${index}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      isDarkMode
                        ? "bg-slate-800 text-slate-200"
                        : "bg-white text-slate-700 ring-1 ring-slate-200"
                    }`}
                  >
                    {item.year ? `${item.year}: ` : ""}
                    {item.role}
                    {item.team ? ` (${item.team})` : ""}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <a
              href={`mailto:${entry.email}`}
              className="inline-flex items-center gap-2 font-medium text-indigo-600 transition hover:text-indigo-500"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>

            {entry.linkedin && (
              <a
                href={entry.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-medium text-indigo-600 transition hover:text-indigo-500"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}

            {entry.instagram && (
              <a
                href={entry.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-medium text-indigo-600 transition hover:text-indigo-500"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            )}
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
