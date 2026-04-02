import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  buildPlacementFaqs,
  summarizeAllYears,
} from "./placementInsights";

export default function PlacementFaqs({ data, yearData }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = useMemo(() => {
    const summaries = summarizeAllYears(data?.yearlyPlacements || []);
    return buildPlacementFaqs({ data, yearData, summaries });
  }, [data, yearData]);

  if (!faqs.length) return null;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
          Placement FAQs
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          Questions students usually ask before comparing placements
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          These answers are generated from the currently visible placement data,
          so they change with the selected college and year.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-slate-900 sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-indigo-600 transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-slate-200 px-4 py-4 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
