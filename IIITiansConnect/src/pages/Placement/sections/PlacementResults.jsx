import StatsGrid from "../elements/StatsGrid";
import PlacementTable from "../elements/PlacementTable";
import PlacementBarSection from "./PlacementBarSection";
import PlacementFaqs from "../shared/PlacementFaqs";

export default function PlacementResults({ data, year, yearData }) {
  return (
    <div className="space-y-8 sm:space-y-12">
      <StatsGrid
        yearData={yearData}
        allYearsData={!year ? data.yearlyPlacements : null}
      />

      <PlacementTable placements={yearData?.placements} />

      <PlacementBarSection yearData={yearData} />

      <PlacementFaqs data={data} yearData={yearData} />
    </div>
  );
}
