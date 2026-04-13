import { useEffect, useState } from "react";
import {
  ExternalLink,
  Link2,
  MoreHorizontal,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const COLLEGE_PLACEHOLDER = "/placeholder.svg";

const CollegeCard = ({ college, teamCount = 0, discussClubs = [] }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const {
    name,
    photo,
    logo,
    gallery,
    description,
    website,
    clubLink,
    clubLinks = [],
  } = college;

  const coverImage = photo?.url || gallery?.[0]?.url || logo?.url || COLLEGE_PLACEHOLDER;
  const logoImage = logo?.url || COLLEGE_PLACEHOLDER;
  const [coverSrc, setCoverSrc] = useState(coverImage);
  const [logoSrc, setLogoSrc] = useState(logoImage);

  useEffect(() => {
    setCoverSrc(coverImage);
  }, [coverImage]);

  useEffect(() => {
    setLogoSrc(logoImage);
  }, [logoImage]);

  const visibleClubLinks = clubLinks.filter((item) => item?.name && item?.url);
  const displayClubLinks =
    visibleClubLinks.length > 0
      ? visibleClubLinks
        : clubLink
        ? [{ name: "Club / Community", url: clubLink }]
        : [];
  const mergedClubs = [
    ...displayClubLinks.map((item, index) => ({
      id: `college-${item.name}-${index}`,
      name: item.name,
      url: item.url,
      source: "college",
      isAuthorized: false,
      badgeLabel: "",
    })),
    ...discussClubs.map((club, index) => ({
      id: club.id || `discuss-${club.clubName}-${index}`,
      name: club.clubName,
      url: "",
      source: "discuss",
      isAuthorized: Boolean(club.isAuthorized),
      badgeLabel: club.badgeLabel || "Verified by network",
    })),
  ];

  const hasExpandableDetails =
    (description && description.length > 140) ||
    mergedClubs.length > 0;

  return (
    <div
      className="
        group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl
      "
    >
      <div className="relative aspect-video overflow-hidden bg-slate-50">
        <img
          src={coverSrc}
          alt={`${name} college`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          onError={() => {
            if (coverSrc !== logoImage && logo?.url) {
              setCoverSrc(logoImage);
              return;
            }
            setCoverSrc(COLLEGE_PLACEHOLDER);
          }}
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
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <img
              src={logoSrc}
              alt={`${name} logo`}
              className="h-8 w-8 object-contain"
              onError={() => setLogoSrc(COLLEGE_PLACEHOLDER)}
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
            {name}
          </h3>
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label={`More options for ${name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-11 z-20 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <Link
                  to={`/discuss?mode=register&college=${encodeURIComponent(name)}`}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                  onClick={() => setShowMenu(false)}
                >
                  Register your club
                </Link>
                <Link
                  to="/guide?flow=discuss"
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  onClick={() => setShowMenu(false)}
                >
                  How club registration works
                </Link>
              </div>
            )}
          </div>
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
          </div>
        )}

        {hasExpandableDetails && (
          <button
            type="button"
            onClick={() => setShowFullDescription((prev) => !prev)}
            className="mb-3 w-fit text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            {showFullDescription ? "See less" : "See more"}
          </button>
        )}

        {showFullDescription && mergedClubs.length > 0 && (
          <div className="mb-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Clubs & Societies
            </div>
            <div className="flex flex-wrap gap-2">
              {mergedClubs.map((club) =>
                club.url ? (
                  <a
                    key={club.id}
                    href={club.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition ${
                      club.source === "discuss"
                        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {club.name}
                    <Link2 size={14} />
                  </a>
                ) : (
                  <span
                    key={club.id}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sm text-sky-700 ring-1 ring-sky-100"
                  >
                    {club.name}
                    {club.isAuthorized && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        <ShieldCheck size={12} />
                        {club.badgeLabel}
                      </span>
                    )}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100">
          {teamCount > 0 && (
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
              <Users size={14} className="text-indigo-500" />
              {teamCount} Network Members
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/team?iiit=${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-1 leading-none rounded-full bg-indigo-600 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-indigo-700 hover:shadow-md"
            >
              View Team
            </Link>
            <Link
              to={`/legacy?iiit=${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-1 leading-none rounded-full bg-emerald-600 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-emerald-700 hover:shadow-md"
            >
              View Legacy
            </Link>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 leading-none rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
              >
                Website <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
