import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { summarizeAllYears } from "../shared/placementInsights";

export default function PlacementGrowthSection({ data, selectedCollegeName }) {
  const summaries = summarizeAllYears(data?.yearlyPlacements || [])
    .slice()
    .sort((a, b) => a.year - b.year)
    .map((summary) => ({
      year: summary.year,
      placementRate: Number(summary.placementRate.toFixed(1)),
      averagePackage: Number(summary.averagePackage.toFixed(1)),
      highestPackage: Number(summary.highestPackage.toFixed(1)),
    }));

  if (summaries.length < 2) return null;

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
          Placement growth
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          {selectedCollegeName || "College"} growth over the years
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Track how placement rate and weighted average package have moved across
          the available placement years.
        </p>
      </div>

      <div className="h-[320px] px-3 py-4 sm:h-[360px] sm:px-4 sm:py-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={summaries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis
              yAxisId="rate"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              yAxisId="package"
              orientation="right"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `${value}L`}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Placement rate") return [`${value}%`, name];
                return [`${value} LPA`, name];
              }}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
              }}
            />
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="placementRate"
              name="Placement rate"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="package"
              type="monotone"
              dataKey="averagePackage"
              name="Weighted average package"
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
