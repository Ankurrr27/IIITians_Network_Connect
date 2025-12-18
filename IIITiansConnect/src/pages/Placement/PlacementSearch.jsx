import { useState } from "react";
import { getPlacementByCollegeName } from "../../api/placementApi";

import PlacementHeader from "./elements/PlacementHeader";
import CollegeSearch from "./elements/CollegeSearch";
import YearSelector from "./elements/YearSelector";
import StatsGrid from "./elements/StatsGrid";
import PlacementTable from "./elements/PlacementTable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- DEFAULT PREVIEW DATA ---------------- */

const TOP_COLLEGES_PREVIEW = [
  {
    name: "IIIT Hyderabad",
    avg: "21.5 LPA",
    highest: "82 LPA",
    placed: "98%",
  },
  {
    name: "IIIT Bangalore",
    avg: "18.2 LPA",
    highest: "65 LPA",
    placed: "96%",
  },
  {
    name: "IIIT Allahabad",
    avg: "14.8 LPA",
    highest: "45 LPA",
    placed: "94%",
  },
  {
    name: "IIIT Delhi",
    avg: "16.5 LPA",
    highest: "51 LPA",
    placed: "95%",
  },
  {
    name: "IIIT Lucknow",
    avg: "12.3 LPA",
    highest: "42 LPA",
    placed: "92%",
  },
  {
    name: "IIIT Gwalior",
    avg: "11.8 LPA",
    highest: "40 LPA",
    placed: "90%",
  },
];


export default function PlacementSearch() {
  const [college, setCollege] = useState("");
  const [data, setData] = useState(null);
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  /* ---------------- SEARCH HANDLER ---------------- */

  const searchCollege = async (name) => {
    if (!name?.trim()) return;

    setCollege(name);
    setLoading(true);
    setSearched(true);

    try {
      const res = await getPlacementByCollegeName(name);
      setData(res.data);

      const years = res.data.yearlyPlacements.map((y) => y.year);
      setYear(Math.max(...years));
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const yearData = year
    ? data?.yearlyPlacements.find((y) => y.year === year)
    : null;

  /* ---------------- OVERALL SNAPSHOT ---------------- */

  const latestYearData = data
    ? data.yearlyPlacements.reduce((latest, curr) =>
        curr.year > latest.year ? curr : latest
      )
    : null;

  const overallStats = latestYearData
    ? latestYearData.placements.reduce(
        (acc, p) => {
          acc.totalStudents += p.totalStudents;
          acc.studentsPlaced += p.studentsPlaced;
          acc.highestPackage = Math.max(
            acc.highestPackage,
            p.highestPackage
          );
          acc.totalAvgPackage += p.averagePackage;
          acc.branches += 1;
          return acc;
        },
        {
          totalStudents: 0,
          studentsPlaced: 0,
          highestPackage: 0,
          totalAvgPackage: 0,
          branches: 0,
        }
      )
    : null;

  const avgPackage =
    overallStats && overallStats.branches
      ? (overallStats.totalAvgPackage / overallStats.branches).toFixed(2)
      : null;

  /* ---------------- BAR CHART DATA ---------------- */

  const barChartData = yearData
    ? yearData.placements.map((p) => ({
        branch: p.branch,
        placed: p.studentsPlaced,
        total: p.totalStudents,
      }))
    : [];

  /* -------------------------------------------------- */

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-12">
      {/* HEADER + SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <PlacementHeader collegeName={searched ? college : null} />

        <section
          className={`grid gap-4 pt-12 mt-4 items-center transition-all ${
            searched ? "lg:grid-cols-[1fr_auto]" : "grid-cols-1"
          }`}
        >
          <div
            className={`bg-white transition-all ${
              searched ? "p-3 w-full" : "p-6 max-w-xl mx-auto"
            }`}
          >
            <CollegeSearch
              value={college}
              onChange={setCollege}
              onSelect={searchCollege}
              loading={loading}
              compact={searched}
            />

            {!searched && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                Start typing a college name to view placement insights.
              </p>
            )}
          </div>

          {data && (
            <div className="bg-white px-4 py-2 flex items-center justify-center">
              <YearSelector
                years={data.yearlyPlacements.map((y) => y.year)}
                value={year}
                onChange={setYear}
              />
            </div>
          )}
        </section>
      </div>

      {/* ---------------- DEFAULT STATE (NO SEARCH) ---------------- */}
      {!searched && !loading && (
        <section className="bg-white border rounded-2xl p-10 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Explore IIIT Placement Insights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search any IIIT to view branch-wise placement statistics, salary
              distribution, and overall placement performance.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TOP_COLLEGES_PREVIEW.map((c) => (
              <div
                key={c.name}
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900">{c.name}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Avg: {c.avg} · Highest: {c.highest}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {c.placed} students placed
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- OVERALL SNAPSHOT ---------------- */}
      {data && overallStats && (
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Overall Placement Snapshot — {latestYearData.year}
              </h3>
              <p className="text-sm text-gray-600">
                Consolidated placement performance of this IIIT
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="text-xl font-bold">
                  {overallStats.totalStudents}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Placed</p>
                <p className="text-xl font-bold text-green-600">
                  {overallStats.studentsPlaced}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Package (LPA)</p>
                <p className="text-xl font-bold">{avgPackage}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Highest (LPA)</p>
                <p className="text-xl font-bold text-indigo-600">
                  {overallStats.highestPackage}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- RESULTS ---------------- */}
      {data && !loading && (
        <div className="space-y-12">
          <StatsGrid
            yearData={yearData}
            allYearsData={!year ? data.yearlyPlacements : null}
          />

          <PlacementTable placements={yearData?.placements} />

          {barChartData.length > 0 && (
            <section className="bg-white border rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Students Placed vs Total Students (Branch-wise)
              </h3>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="branch" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#E5E7EB" />
                    <Bar dataKey="placed" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ---------------- NO DATA ---------------- */}
      {searched && !loading && !data && (
        <div className="text-center py-10 text-gray-500">
          No placement data found for this college.
        </div>
      )}
    </div>
  );
}
