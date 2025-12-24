import { TOP_COLLEGES_PREVIEW } from "../data/previewColleges";

export default function PlacementPreview() {
  return (
    <section
      className="
        bg-white
        sm:border rounded-2xl
        p-4 sm:p-8 lg:p-10
        space-y-5 sm:space-y-8
      "
    >
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-md sm:text-2xl font-semibold">
          Explore IIIT Placement Insights
        </h2>
        <p className="text-xs sm:text-base text-gray-600 max-w-2xl mx-auto">
          Search any IIIT to view branch-wise placement data.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {TOP_COLLEGES_PREVIEW.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            className="
              bg-white border rounded-xl
              py-3 px-1 sm:p-5
              flex flex-row sm:flex-row
              items-center gap-3 sm:gap-4
              hover:shadow-md transition
            "
          >
            {/* LOGO */}
            <div
              className="
                w-14 h-14
                sm:w-24 sm:h-24
                flex-shrink-0
                bg-gray-50 rounded-lg
                flex items-center justify-center
              "
            >
              <img
                src={c.logo}
                alt={`${c.name} logo`}
                className="max-h-10 sm:max-h-18 object-contain"
                onError={(e) => {
                  e.target.src = "/fallback-college.png";
                }}
              />
            </div>

            {/* TEXT */}
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                {c.name}
              </p>
           
              <p className="text-[11px] sm:text-xs text-green-600 mt-0.5">
                {c.placed} placed
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
