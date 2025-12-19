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
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
      <PlacementHeader collegeName={searched ? college : null} />

      <section
        className={`grid gap-4 pt-4 sm:pt-12 mt-4 items-center ${
          searched ? "lg:grid-cols-[1fr_auto]" : "grid-cols-1"
        }`}
      >
        {/* SEARCH + YEAR (MOBILE COMBINED) */}
        <div
          className={`
            bg-white rounded-xl
            ${searched ? "p-3" : "p-4 sm:p-6 max-w-xl mx-auto"}
            space-y-3
            lg:space-y-0
          `}
        >
          <CollegeSearch
            value={college}
            onChange={onCollegeChange}
            onSelect={onSearch}
            loading={loading}
            compact={searched}
          />

          {/* YearSelector INSIDE search on mobile */}
          {data && (
            <div className="block lg:hidden">
              <YearSelector
                years={data.yearlyPlacements.map(y => y.year)}
                value={year}
                onChange={onYearChange}
              />
            </div>
          )}
        </div>

        {/* YearSelector SEPARATE on desktop */}
        {data && (
          <div className="hidden lg:flex bg-white px-4 py-2 items-center justify-center rounded-xl">
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
