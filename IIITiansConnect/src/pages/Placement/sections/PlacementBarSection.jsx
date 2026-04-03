import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PlacementBarSection({ yearData }) {
  if (!yearData?.placements?.length) return null;

  const barChartData = yearData.placements
    .map((placement) => ({
      branch: placement.branch,
      placementRate: Number(placement.placementPercentage || 0),
      averagePackage: Number(placement.averagePackage || 0),
      highestPackage: Number(placement.highestPackage || 0),
    }))
    .sort((a, b) => b.placementRate - a.placementRate);

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
          Branch comparison
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          Placement performance by branch
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Compare placement rate across branches and see which departments are
          leading the placement season.
        </p>
      </div>

      <div className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_280px]">
        <div className="h-[320px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="branch"
                tick={{ fontSize: 11, fill: "#64748b" }}
                angle={-24}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value, name, payload) => {
                  if (name === "Placement rate") {
                    return [`${value}%`, name];
                  }

                  return [`${value} LPA`, name];
                }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
                }}
              />
              <Bar
                dataKey="placementRate"
                name="Placement rate"
                radius={[10, 10, 0, 0]}
              >
                {barChartData.map((item, index) => (
                  <Cell
                    key={`${item.branch}-${index}`}
                    fill={index === 0 ? "#4f46e5" : "#93c5fd"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {barChartData.slice(0, 4).map((item, index) => (
            <div
              key={item.branch}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.branch}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {index === 0 ? "Top branch" : `Rank ${index + 1}`}
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-indigo-700 ring-1 ring-slate-200">
                  {item.placementRate.toFixed(1)}%
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <InfoPill label="Avg" value={`${item.averagePackage.toFixed(1)} LPA`} />
                <InfoPill label="High" value={`${item.highestPackage.toFixed(1)} LPA`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
