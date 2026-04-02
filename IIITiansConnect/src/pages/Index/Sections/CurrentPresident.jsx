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
    <div className="mb-6 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 shadow-[0_20px_60px_rgba(79,70,229,0.08)] sm:mb-12 sm:rounded-[1.75rem]">
      <div className="grid gap-0 md:grid-cols-[280px_1fr]">
        <div className="relative h-48 overflow-hidden bg-indigo-100 sm:h-56 md:h-full">
          <img
            src={currentPresident.image}
            alt={currentPresident.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent md:bg-gradient-to-r md:from-slate-950/10 md:to-transparent" />
        </div>

        <div className="p-4 sm:p-8">
          <div className="inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:px-3 sm:text-xs sm:tracking-[0.2em]">
            Current President
          </div>

          <h3 className="mt-3 text-xl font-bold text-slate-900 sm:mt-4 sm:text-3xl">
            {currentPresident.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-indigo-600 sm:text-base">
            {currentPresident.role} · {currentPresident.college}
          </p>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            {currentPresident.about}
          </p>

          <div className="mt-4 rounded-[1.2rem] border border-indigo-100 bg-white/80 p-3.5 shadow-sm sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600 sm:text-xs sm:tracking-[0.2em]">
              Message
            </p>
            <p className="mt-2.5 text-sm leading-6 text-slate-700 sm:mt-3 sm:text-base sm:leading-7">
              {currentPresident.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
