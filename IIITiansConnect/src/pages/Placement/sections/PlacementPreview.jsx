import PlacementFaqs from "../shared/PlacementFaqs";
import { TOP_COLLEGES_PREVIEW } from "../data/previewColleges";

export default function PlacementPreview() {
  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Explore Before You Compare
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-3xl">
            Explore IIIT placement insights
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Search any IIIT to view branch-wise packages, placement rates, and
            a clearer year-wise story instead of only headline numbers.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_COLLEGES_PREVIEW.map((college, index) => (
            <div
              key={`${college.name}-${index}`}
              className="flex items-center gap-4 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white">
                <img
                  src={college.logo}
                  alt={`${college.name} logo`}
                  className="max-h-10 object-contain"
                  onError={(event) => {
                    event.target.src = "/fallback-college.png";
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="font-semibold leading-tight text-slate-900">
                  {college.name}
                </p>
                <p className="mt-1 text-sm text-emerald-600">
                  {college.placed} placed
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PlacementFaqs />
    </div>
  );
}
