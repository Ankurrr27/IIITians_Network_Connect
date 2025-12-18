import { TOP_COLLEGES_PREVIEW } from "../data/previewColleges";

export default function PlacementPreview() {
  return (
    <section className="bg-white border rounded-2xl p-10 space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold">
          Explore IIIT Placement Insights
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Search any IIIT to view branch-wise placement data.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOP_COLLEGES_PREVIEW.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            className="
              bg-white border rounded-xl p-5
              flex items-center gap-4
              hover:shadow-md transition
            "
          >
            {/* Logo */}
            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
              <img
                src={c.logo}
                alt={`${c.name} logo`}
                className="max-h-18 object-contain"
                onError={(e) => {
                  e.target.src = "/fallback-college.png";
                }}
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {c.name}
              </p>
              <p className="text-sm text-gray-600">
                Avg {c.avg} · Highest {c.highest}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {c.placed} placed
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
