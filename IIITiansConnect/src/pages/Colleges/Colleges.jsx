import { useEffect, useState } from "react";
import api from "../../api/axios";

import CollegesHeader from "./Section/CollegesHeader";
import CollegesSearch from "./Section/CollegesSearch";
import CollegesGrid from "./Section/CollegesGrid";

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [discussClubs, setDiscussClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("NONE");

  useEffect(() => {
    Promise.allSettled([
      api.get("/colleges"),
      api.get("/team"),
      api.get("/discuss-accounts/public"),
    ])
      .then(([collegesResult, teamResult, discussAccountsResult]) => {
        if (collegesResult.status !== "fulfilled") {
          throw new Error("Failed to load colleges");
        }

        setColleges(collegesResult.value.data || []);
        setTeamMembers(
          teamResult.status === "fulfilled" ? teamResult.value.data || [] : []
        );
        setDiscussClubs(
          discussAccountsResult.status === "fulfilled"
            ? discussAccountsResult.value.data || []
            : []
        );
      })
      .catch(() => setError("Failed to load colleges"))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 FILTER LOGIC (belongs here)
  let filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === "AZ") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (filter === "ZA") filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (filter === "WEBSITE") filtered = filtered.filter((c) => c.website);

  if (loading) return <CenterText text="Loading IIITs..." />;
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
        />

        <CollegesGrid
          colleges={filtered}
          teamMembers={teamMembers}
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
