import { useState } from "react";
import { ExternalLink, Link2, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CollegeCard = ({ college, teamCount = 0, discussClubs = [] }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { name, photo, logo, gallery, description, website, clubLink, clubLinks = [] } = college;
  const coverImage =
    photo?.url || gallery?.[0]?.url || logo?.url || "/placeholder-logo.png";
  const logoImage = logo?.url || "/placeholder-logo.png";
  const visibleClubLinks = clubLinks.filter((item) => item?.name && item?.url);
  const displayClubLinks =
    visibleClubLinks.length > 0
      ? visibleClubLinks
      : clubLink
        ? [{ name: "Club / Community", url: clubLink }]
        : [];

  return (
    <div
      className="
        group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl
      "
    >
      <div className="relative h-35 overflow-hidden bg-slate-50 sm:h-44">
        <img
          src={coverImage}
          alt={`${name} college`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />

        <div
          className="
            pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent
            opacity-0 transition-opacity duration-300 group-hover:opacity-100
          "
        />
      </div>

      <div
        className="
          flex flex-1 flex-col bg-white p-4 transition-all duration-300 ease-out
          group-hover:-translate-y-1 sm:p-6
        "
      >
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <img
              src={logoImage}
              alt={`${name} logo`}
              className="h-8 w-8 object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
            {name}
          </h3>
        </div>

        {description && (
          <div className="mb-3">
            <p
              className={`text-sm text-gray-600 ${
                showFullDescription ? "" : "line-clamp-4"
              }`}
            >
              {description}
            </p>
            {description.length > 140 && (
              <button
                type="button"
                onClick={() => setShowFullDescription((prev) => !prev)}
                className="mt-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
              >
                {showFullDescription ? "See less" : "See more"}
              </button>
            )}
          </div>
        )}

        {displayClubLinks.length > 0 && (
          <div className="mb-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Clubs & Societies
            </div>
            <div className="flex flex-wrap gap-2">
              {displayClubLinks.map((item, index) => (
                <a
                  key={`${item.name}-${index}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
                >
                  {item.name} <Link2 size={14} />
                </a>
              ))}
            </div>
          </div>
        )}

        {discussClubs.length > 0 && (
          <div className="mb-4 rounded-2xl bg-sky-50/80 p-3 ring-1 ring-sky-100">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Network Clubs on Discuss
            </div>
            <div className="space-y-2">
              {discussClubs.slice(0, 4).map((club) => (
                <div
                  key={club.id}
                  className="rounded-xl bg-white px-3 py-2 ring-1 ring-sky-100"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{club.clubName}</span>
                    {club.isAuthorized && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        <ShieldCheck size={12} />
                        {club.badgeLabel || "Verified by network"}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {club.contactName}
                    {club.contactPhone ? ` · ${club.contactPhone}` : ""}
                  </div>
                </div>
              ))}
            </div>
            {discussClubs.length > 4 && (
              <p className="mt-3 text-xs font-medium text-sky-700">
                +{discussClubs.length - 4} more club{discussClubs.length - 4 > 1 ? "s" : ""} active on Discuss
              </p>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 transition hover:bg-indigo-100"
            >
              Visit Website <ExternalLink size={14} />
            </a>
          )}

          <Link
            to={`/legacy?iiit=${encodeURIComponent(name)}`}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 transition hover:bg-emerald-100"
          >
            {teamCount} network members <Users size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
