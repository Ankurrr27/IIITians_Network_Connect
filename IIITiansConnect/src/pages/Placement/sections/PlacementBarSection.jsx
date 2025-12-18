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
  );
}
