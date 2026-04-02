import { useState } from "react";
import { getPlacementByCollegeName } from "../../api/placementApi";

import PlacementSearchBar from "./sections/PlacementSearchBar";
import PlacementPreview from "./sections/PlacementPreview";
import PlacementSnapshot from "./sections/PlacementSnapshot";
import PlacementResults from "./sections/PlacementResults";

export default function Placement() {
  const [college, setCollege] = useState("");
  const [data, setData] = useState(null);
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchCollege = async (name) => {
    if (!name?.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await getPlacementByCollegeName(name);
      setData(res.data);

      const years = (res.data.yearlyPlacements || []).map((entry) => entry.year);
      setYear(years.length ? Math.max(...years) : null);
    } catch (err) {
      console.error("Placement fetch failed:", err);
      setData(null);
      setYear(null);
    } finally {
      setLoading(false);
    }
  };

  const yearData = year
    ? data?.yearlyPlacements.find(y => y.year === year)
    : null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-24 sm:space-y-12 sm:px-6 sm:pb-16 sm:pt-28">
      <PlacementSearchBar
        college={college}
        searched={searched}
        loading={loading}
        data={data}
        onSearch={searchCollege}
        onCollegeChange={setCollege}
        year={year}
        onYearChange={setYear}
      />

      {!searched && <PlacementPreview />}

      {data && <PlacementSnapshot data={data} />}

      {data && !loading && (
        <PlacementResults
          data={data}
          year={year}
          yearData={yearData}
        />
      )}

      {searched && !loading && !data && (
        <p className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500 sm:px-6 sm:py-12">
          No placement data found.
        </p>
      )}
    </div>
  );
}
