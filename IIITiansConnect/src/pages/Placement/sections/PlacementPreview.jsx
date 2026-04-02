import { useEffect, useState } from "react";
import PlacementFaqs from "../shared/PlacementFaqs";
import { getAllPlacements } from "../../../api/placementApi";
import {
  formatLpa,
  summarizePlacementCollection,
} from "../shared/placementInsights";

export default function PlacementPreview() {
  const [previewItems, setPreviewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getAllPlacements()
      .then((response) => {
        if (!mounted) return;
        const summaries = summarizePlacementCollection(response.data || []);
        setPreviewItems(summaries.slice(0, 6));
      })
      .catch(() => {
        if (!mounted) return;
        setPreviewItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-8 lg:p-10">
        <div className="text-left sm:text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Explore Before You Compare
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-3xl">
            Explore IIIT placement insights
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mx-auto sm:text-base sm:leading-7">
            Search any IIIT to view branch-wise packages, placement rates, and
            a clearer year-wise story instead of only headline numbers.
          </p>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-white" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-12 rounded-xl bg-white" />
                  <div className="h-12 rounded-xl bg-white" />
                </div>
              </div>
            ))}
          </div>
        ) : previewItems.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {previewItems.map((college) => (
              <div
                key={college.id}
                className="rounded-[1.15rem] border border-slate-200 bg-slate-50 p-3.5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm sm:rounded-[1.25rem] sm:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white sm:h-16 sm:w-16">
                    <img
                      src={college.collegeLogo}
                      alt={`${college.collegeName} logo`}
                      className="max-h-10 object-contain"
                      onError={(event) => {
                        event.target.src = "/fallback-college.png";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-semibold leading-tight text-slate-900 sm:text-base">
                      {college.collegeName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Latest visible year: {college.year}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                  <PreviewStat
                    label="Highest package"
                    value={formatLpa(college.highestPackage)}
                  />
                  <PreviewStat
                    label="Placement rate"
                    value={`${college.placementRate.toFixed(1)}%`}
                  />
                  <PreviewStat
                    label="Median package"
                    value={formatLpa(college.medianPackage)}
                  />
                  <PreviewStat
                    label="Highest placement"
                    value={`${college.highestPlacementPercentage.toFixed(1)}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500 sm:mt-8">
            Placement previews will appear here once colleges have real
            placement records in the database.
          </div>
        )}
      </section>

      <PlacementFaqs />
    </div>
  );
}

function PreviewStat({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold text-slate-900 sm:text-sm">{value}</p>
    </div>
  );
}
