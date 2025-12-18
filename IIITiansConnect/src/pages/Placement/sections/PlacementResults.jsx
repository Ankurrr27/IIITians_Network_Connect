import StatsGrid from "../elements/StatsGrid";
import PlacementTable from "../elements/PlacementTable";
import PlacementBarSection from "./PlacementBarSection";

export default function PlacementResults({ data, year, yearData }) {
  return (
    <div className="space-y-12">
      <StatsGrid
        yearData={yearData}
        allYearsData={!year ? data.yearlyPlacements : null}
      />

      <PlacementTable placements={yearData?.placements} />

      <PlacementBarSection yearData={yearData} />
    </div>
  );
}
