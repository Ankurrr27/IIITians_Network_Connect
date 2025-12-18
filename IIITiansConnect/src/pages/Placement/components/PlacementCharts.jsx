import BranchBarChart from "./BranchBarChart";
import PlacementPieChart from "./PlacementPieChart";
import YearClusterBarChart from "./YearClusterBarChart";
import ChartLegend from "./ChartLegend";

export default function PlacementCharts({
  yearlyPlacements = [],
  yearData,
}) {
  const hasYearlyData = yearlyPlacements.length > 0;
  const hasSingleYearData =
    yearData && yearData.placements?.length > 0;

  if (!hasYearlyData) {
    return (
      <div className="text-center py-16 text-gray-500">
        No chart data available
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Legend always visible */}
      <ChartLegend />

      {/* Single year view */}
      {hasSingleYearData ? (
        <>
          <BranchBarChart yearData={yearData} />
          <PlacementPieChart yearData={yearData} />
        </>
      ) : (
        /* All years view */
        <YearClusterBarChart
          yearlyPlacements={yearlyPlacements}
        />
      )}
    </div>
  );
}
