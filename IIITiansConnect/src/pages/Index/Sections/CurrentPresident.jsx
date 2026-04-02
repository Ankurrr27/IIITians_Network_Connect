const currentPresident = {
  name: "Lokesh",
  role: "Current President",
  college: "IIITians Network",
  image: "/lokesh.png",
  about:
    "Focused on carrying the next phase of IIITians Network with stronger collaboration, student-first execution, and wider community impact across campuses.",
  message:
    "My goal is to make IIITians Network more useful, more accessible, and more connected for every student. We want this platform to feel active, trusted, and genuinely valuable for the entire IIIT community.",
};

export default function CurrentPresident() {
  return (
    <div className="mb-5 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50 shadow-[0_20px_60px_rgba(79,70,229,0.08)] sm:mb-12 sm:rounded-[1.9rem]">
      <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
        <div className="relative h-44 overflow-hidden bg-indigo-100 sm:h-72 lg:h-full">
          <img
            src={currentPresident.image}
            alt={currentPresident.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/45 to-transparent lg:hidden" />
        </div>

        <div className="p-3.5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:px-3 sm:text-xs sm:tracking-[0.18em]">
                Current President
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:text-xs sm:tracking-[0.16em]">
                Team Spotlight
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 sm:text-3xl">
                {currentPresident.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-indigo-600 sm:text-base">
                {currentPresident.role} · {currentPresident.college}
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1rem] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[1.2rem] sm:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs sm:tracking-[0.16em]">
                  About
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-700 sm:mt-3 sm:text-base sm:leading-7">
                  {currentPresident.about}
                </p>
              </div>

              <div className="rounded-[1rem] border border-indigo-100 bg-indigo-50/60 p-3 shadow-sm sm:rounded-[1.2rem] sm:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-600 sm:text-xs sm:tracking-[0.16em]">
                  Message
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-700 sm:mt-3 sm:text-base sm:leading-7">
                  "{currentPresident.message}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
