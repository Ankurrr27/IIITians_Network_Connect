import { MapPin } from "lucide-react";

export default function CollegesHeader() {
  return (
    <div className="mb-8 px-3 text-left sm:mb-12 sm:px-0 sm:text-center flex flex-col items-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
        <MapPin className="h-4 w-4" />
        IIITs Directory
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        Indian Institutes of Information Technology
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Explore official information about IIITs across India.
      </p>
    </div>
  );
}
