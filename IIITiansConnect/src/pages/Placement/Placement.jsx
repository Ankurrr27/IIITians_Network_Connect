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

      const years = res.data.yearlyPlacements.map(y => y.year);
      setYear(Math.max(...years));
    } catch (err) {
      console.error("Placement fetch failed:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const yearData = year
    ? data?.yearlyPlacements.find(y => y.year === year)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-4 pb-0 sm:py-6 sm:space-y-12">
      {/* Search */}
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

      {/* Default Preview */}
      {!searched && <PlacementPreview />}

     

      {/* Snapshot */}
      {data && <PlacementSnapshot data={data} />}

      {/* Results */}
      {data && !loading && (
        <PlacementResults
          data={data}
          year={year}
          yearData={yearData}
        />
      )}

      {/* No Data */}
      {searched && !loading && !data && (
        <p className="text-center text-gray-500">
          No placement data found.
        </p>
      )}
    </div>
  );
}
