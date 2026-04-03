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
    <div className="space-y-4 sm:space-y-5">
      <PlacementHeader collegeName={searched ? college : null} />

      <section
        className={`grid gap-3 sm:gap-4 ${
          searched ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-1"
        }`}
      >
        <div
          className={`w-full rounded-[1.25rem] border border-slate-200 bg-white shadow-sm ${
            searched ? "p-3 sm:p-4" : "p-3 sm:p-5"
          }`}
        >
          <CollegeSearch
            value={college}
            onChange={onCollegeChange}
            onSelect={onSearch}
            loading={loading}
            compact={searched}
          />

          {data && (
            <div className="mt-3 block lg:hidden">
              <YearSelector
                years={data.yearlyPlacements.map((item) => item.year)}
                value={year}
                onChange={onYearChange}
              />
            </div>
          )}
        </div>

        {data && (
          <div className="hidden rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm lg:flex lg:items-center">
            <YearSelector
              years={data.yearlyPlacements.map((item) => item.year)}
              value={year}
              onChange={onYearChange}
            />
          </div>
        )}
      </section>
    </div>
  );
}
