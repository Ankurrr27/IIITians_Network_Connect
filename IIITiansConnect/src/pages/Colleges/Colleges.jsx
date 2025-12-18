import { useEffect, useState } from "react";
import api from "../../api/axios";

import CollegesHeader from "./Section/CollegesHeader";
import CollegesSearch from "./Section/CollegesSearch";
import CollegesGrid from "./Section/CollegesGrid";

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("NONE");

  useEffect(() => {
    api
      .get("/colleges")
      .then((res) => setColleges(res.data))
      .catch(() => setError("Failed to load colleges"))
      .finally(() => setLoading(false));
  }, []);

  const handleCollegeUpdate = (updated) => {
    setColleges((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
  };

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <CollegesHeader />

        <CollegesSearch
          search={search}
          setSearch={setSearch}
          setFilter={setFilter}
        />

        <CollegesGrid
          colleges={filtered}
          onUpdated={handleCollegeUpdate}
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
