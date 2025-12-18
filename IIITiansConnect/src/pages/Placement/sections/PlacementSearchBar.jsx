import PlacementHeader from "../elements/PlacementHeader";
import CollegeSearch from "../elements/CollegeSearch";
import YearSelector from "../elements/YearSelector";

export default function PlacementSearchBar({
  college,
  searched,
  loading,
  data,
  onSearch,
  onCollegeChange,
  year,
  onYearChange,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <PlacementHeader collegeName={searched ? college : null} />

      <section
        className={`grid gap-4 pt-12 mt-4 items-center ${
          searched ? "lg:grid-cols-[1fr_auto]" : "grid-cols-1"
        }`}
      >
        <div className={`bg-white ${searched ? "p-3" : "p-6 max-w-xl mx-auto"}`}>
          <CollegeSearch
            value={college}
            onChange={onCollegeChange}
            onSelect={onSearch}
            loading={loading}
            compact={searched}
          />
        </div>

        {data && (
          <div className="bg-white px-4 py-2 flex items-center justify-center">
            <YearSelector
              years={data.yearlyPlacements.map(y => y.year)}
              value={year}
              onChange={onYearChange}
            />
          </div>
        )}
      </section>
    </div>
  );
}
