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
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <PlacementHeader collegeName={searched ? college : null} />

      <section
        className={`grid gap-4 ${
          searched ? "lg:grid-cols-[1fr_auto]" : "grid-cols-1"
        }`}
      >
        <div
          className={`rounded-[1.5rem] border border-slate-200 bg-white shadow-sm ${
            searched ? "p-3 sm:p-4" : "mx-auto max-w-xl p-4 sm:p-6"
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
          <div className="hidden rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-sm lg:flex lg:items-center">
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
