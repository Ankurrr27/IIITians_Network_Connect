import { useEffect, useMemo, useState } from "react";
import {
  getAllPlacements,
  getPlacementByCollegeName,
} from "../../api/placementApi";

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
  const [collegeOptions, setCollegeOptions] = useState([]);

  useEffect(() => {
    getAllPlacements()
      .then((response) => {
        const names = (response.data || [])
          .map((item) => item?.college?.name)
          .filter(Boolean);

        setCollegeOptions(
          [...new Set(names)].sort((a, b) => a.localeCompare(b))
        );
      })
      .catch(() => {
        setCollegeOptions([]);
      });
  }, []);

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

  const selectedCollegeName = useMemo(() => {
    if (data?.college?.name) {
      return data.college.name;
    }

    return searched ? college : null;
  }, [college, data, searched]);

  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,_#eff6ff_0%,_#f8faff_40%,_#ffffff_100%)] pb-14 pt-20 text-slate-900 sm:pb-20 sm:pt-24">
      {/* Radial Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-7 px-4 sm:space-y-10 sm:px-6">
        <PlacementSearchBar
          college={college}
          suggestions={collegeOptions}
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
            selectedCollegeName={selectedCollegeName}
          />
        )}

        {searched && !loading && !data && (
          <p className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500 sm:px-6 sm:py-12">
            No placement data found.
          </p>
        )}
      </div>
    </div>
  );
}
