import StatsGrid from "../elements/StatsGrid";
import PlacementTable from "../elements/PlacementTable";
import PlacementBarSection from "./PlacementBarSection";
import PlacementGrowthSection from "./PlacementGrowthSection";
import PlacementFaqs from "../shared/PlacementFaqs";

export default function PlacementResults({ data, year, yearData, selectedCollegeName }) {
  return (
    <div className="space-y-8 sm:space-y-12">
      <StatsGrid
        yearData={yearData}
        allYearsData={!year ? data.yearlyPlacements : null}
      />

      <PlacementGrowthSection
        data={data}
        selectedCollegeName={selectedCollegeName}
      />

      <PlacementTable placements={yearData?.placements} />

      <PlacementBarSection yearData={yearData} />

      <PlacementFaqs data={data} yearData={yearData} />
    </div>
  );
}
