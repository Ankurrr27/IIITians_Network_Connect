import { useEffect, useState } from "react";
import api from "../../api/axios";
import { notifyAppAction, notifyPageEntry } from "../../utils/appNotifications";

import CollegesHeader from "./Section/CollegesHeader";
import CollegesSearch from "./Section/CollegesSearch";
import CollegesGrid from "./Section/CollegesGrid";

const RECENT_COLLEGE_SEARCHES_KEY = "iiitians-network-recent-college-searches";

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [legacyMembers, setLegacyMembers] = useState([]);
  const [discussClubs, setDiscussClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("NONE");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = JSON.parse(
        localStorage.getItem(RECENT_COLLEGE_SEARCHES_KEY) || "[]"
      );
      setRecentSearches(Array.isArray(stored) ? stored.filter(Boolean) : []);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    notifyPageEntry(
      "Congratulations, colleges page loaded",
      "The IIIT directory is ready to explore.",
      "page-colleges-loaded"
    );

    const requestNonce = Date.now();
    Promise.allSettled([
      api.get("/colleges", {
        params: { _: requestNonce },
        headers: { "Cache-Control": "no-cache" },
      }),
      api.get("/team"),
      api.get("/alumni"),
      api.get("/discuss-accounts/public"),
    ])
      .then(([collegesResult, teamResult, legacyResult, discussAccountsResult]) => {
        if (collegesResult.status !== "fulfilled") {
          throw new Error("Failed to load colleges");
        }

        const rawColleges = collegesResult.value.data || [];
        setColleges([...rawColleges].sort((a, b) => a.name?.localeCompare(b.name)));
        setTeamMembers(
          teamResult.status === "fulfilled" ? teamResult.value.data || [] : []
        );
        setLegacyMembers(
          legacyResult.status === "fulfilled" ? legacyResult.value.data || [] : []
        );
        setDiscussClubs(
          discussAccountsResult.status === "fulfilled"
            ? discussAccountsResult.value.data || []
            : []
        );
        notifyAppAction({
          title: "Congratulations, college data fetched",
          message: "The college directory data has been loaded successfully.",
          type: "club",
          dedupeKey: "colleges-data-fetched",
        });
      })
      .catch(() => setError("Failed to load colleges"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch || normalizedSearch.length < 2) return;

    const searchToastTimer = setTimeout(() => {
      notifyAppAction({
        title: "Congratulations, searching for colleges",
        message: `Looking through the college directory for "${search.trim()}".`,
        type: "club",
        dedupeKey: `college-search-${normalizedSearch}`,
        dedupeWindowMs: 120000,
      });
    }, 500);

    const timer = setTimeout(() => {
      const matchedCollege = colleges.find(
        (college) => (college.name || "").trim().toLowerCase() === normalizedSearch
      );

      if (!matchedCollege) return;

      const nextRecent = [
        matchedCollege.name,
        ...recentSearches.filter(
          (item) => item.trim().toLowerCase() !== normalizedSearch
        ),
      ].slice(0, 8);

      setRecentSearches(nextRecent);
      localStorage.setItem(
        RECENT_COLLEGE_SEARCHES_KEY,
        JSON.stringify(nextRecent)
      );
    }, 250);

    return () => {
      clearTimeout(timer);
      clearTimeout(searchToastTimer);
    };
  }, [search, colleges, recentSearches]);

  let filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === "AZ") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (filter === "ZA") filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (filter === "WEBSITE") filtered = filtered.filter((c) => c.website);
  if (filter === "RECENT") {
    const recentIndexMap = new Map(
      recentSearches.map((item, index) => [item.trim().toLowerCase(), index])
    );

    filtered.sort((a, b) => {
      const indexA = recentIndexMap.has((a.name || "").trim().toLowerCase())
        ? recentIndexMap.get((a.name || "").trim().toLowerCase())
        : Number.MAX_SAFE_INTEGER;
      const indexB = recentIndexMap.has((b.name || "").trim().toLowerCase())
        ? recentIndexMap.get((b.name || "").trim().toLowerCase())
        : Number.MAX_SAFE_INTEGER;

      if (indexA !== indexB) return indexA - indexB;
      return a.name.localeCompare(b.name);
    });
  }

  if (loading) return <CollegesSkeletonPage />;
  if (error) return <CenterText text={error} error />;

  return (
    <section className="relative min-h-screen bg-[linear-gradient(180deg,_#eef7ff_0%,_#f7fbff_36%,_#f9fcff_100%)] pb-14 pt-20 sm:pb-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <CollegesHeader colleges={colleges} />

        <CollegesSearch
          search={search}
          setSearch={setSearch}
          setFilter={setFilter}
          hasRecentSearches={recentSearches.length > 0}
        />

        <CollegesGrid
          colleges={filtered}
          teamMembers={teamMembers}
          legacyMembers={legacyMembers}
          discussClubs={discussClubs}
        />
      </div>
    </section>
  );
}

function CenterText({ text, error }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        error ? "text-red-500" : "text-gray-600"
      }`}
    >
      {text}
    </div>
  );
}

function CollegesSkeletonPage() {
  return (
    <section className="relative min-h-screen bg-[linear-gradient(180deg,_#eef7ff_0%,_#f7fbff_36%,_#f9fcff_100%)] pb-14 pt-20 sm:pb-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded-full bg-indigo-100" />
          <div className="mt-4 h-10 w-full max-w-xl rounded-2xl bg-slate-200" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-xl bg-slate-200" />
          <div className="mt-8 h-14 w-full max-w-xl rounded-2xl bg-white/90 ring-1 ring-slate-200" />

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-44 bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-200" />
                    <div className="h-6 w-40 rounded-xl bg-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-slate-200" />
                    <div className="h-3 rounded-full bg-slate-200" />
                    <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                  </div>
                  <div className="flex gap-2 pt-3">
                    <div className="h-9 w-24 rounded-full bg-slate-200" />
                    <div className="h-9 w-24 rounded-full bg-slate-200" />
                    <div className="h-9 w-24 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
