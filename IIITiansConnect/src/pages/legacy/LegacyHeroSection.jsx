import { Sparkles } from "lucide-react";

export default function LegacyHeroSection({ isDarkMode, stats }) {
  return (
    <div className="relative pb-8 sm:pb-12 lg:pb-14">
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl lg:pr-8">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${
                isDarkMode
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                  : "border-indigo-100 bg-white/90 text-indigo-700 shadow-sm"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Network Legacy
            </div>

            <h1
              className={`mt-5 text-3xl font-semibold tracking-tight sm:text-5xl ${
                isDarkMode ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Network Legacy
            </h1>

            <p
              className={`mt-4 max-w-3xl text-sm leading-7 sm:text-base ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              "Once a member of the network, always a part of its legacy."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:flex-shrink-0 lg:items-end lg:justify-end">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 transition-transform hover:translate-y-[-1px]"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div
                      className={`text-xl font-bold leading-none ${
                        isDarkMode ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </div>
                    <div
                      className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-10 h-px w-full ${
            isDarkMode
              ? "bg-gradient-to-r from-transparent via-slate-700 to-transparent"
              : "bg-gradient-to-r from-transparent via-indigo-100 to-transparent"
          }`}
        />
    </div>
  );
}
