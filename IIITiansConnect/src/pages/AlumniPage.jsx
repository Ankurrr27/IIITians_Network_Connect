import { Construction } from "lucide-react";

export default function Alumni() {
  return (
    <div className="min-h-[100vh] flex items-center justify-center px-6 mt-19 bg-gradient-to-b from-white to-slate-50">
      <div className="text-center max-w-xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 shadow-sm">
            <Construction size={64} />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-4">
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Under Development
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Alumni Section Coming Soon
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          We’re currently building a dedicated space to showcase alumni
          achievements, career journeys, and contributions across all IIITs.
          <br />
          <br />
          This section is under active development and will be launching soon.
        </p>

        {/* Sub text */}
        <p className="text-xs text-gray-500">
          Stay tuned
        </p>
      </div>
    </div>
  );
}
