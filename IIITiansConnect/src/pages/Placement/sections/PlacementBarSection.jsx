import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PlacementBarSection({ yearData }) {
  if (!yearData) return null;

  const barChartData = yearData.placements.map((p) => ({
    branch: p.branch,
    total: p.totalStudents,
    placed: p.studentsPlaced,
  }));

  return (
    <section
      className="
        bg-white sm:border rounded-2xl
        p-4 sm:p-6
      "
    >
      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3 sm:mb-4">
        Students Placed vs Total Students (Branch-wise)
      </h3>

      {/* Chart */}
      <div className="h-[260px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 30,
            }}
          >
            <XAxis
              dataKey="branch"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="total" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="placed" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
