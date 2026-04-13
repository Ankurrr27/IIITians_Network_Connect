import { Sparkles } from "lucide-react";
import { cardShell } from "./constants.js";

export default function LegacyHeroSection({ isDarkMode, stats }) {
  return (
    <section className="relative z-10 px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        <div
          className={`relative overflow-hidden rounded-[2rem] border px-5 py-8 shadow-[0_24px_70px_rgba(148,163,184,0.14)] sm:px-8 sm:py-10 lg:px-10 lg:py-12 ${
            isDarkMode
              ? "border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.82))]"
              : "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.7))] backdrop-blur-sm"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(56,189,248,0.1),transparent_28%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
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
                className={`mt-4 text-3xl font-semibold tracking-tight sm:text-5xl ${
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

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem] lg:flex-shrink-0">
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`group rounded-[1.35rem] border px-4 py-4 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(99,102,241,0.12)] sm:px-4.5 ${
                      isDarkMode
                        ? `${cardShell.dark} hover:border-indigo-500/30`
                        : "border-white/90 bg-white/85 shadow-[0_14px_34px_rgba(148,163,184,0.12)] hover:border-indigo-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                          isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 text-indigo-600" />
                      </div>
                      <div className="min-w-0 text-right">
                        <div
                          className={`text-2xl font-semibold leading-none ${
                            isDarkMode ? "text-slate-100" : "text-slate-900"
                          }`}
                        >
                          {item.value}
                        </div>
                        <div
                          className={`mt-2 text-sm leading-5 ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {item.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`mt-8 h-px w-full ${
            isDarkMode
              ? "bg-gradient-to-r from-transparent via-slate-700 to-transparent"
              : "bg-gradient-to-r from-transparent via-indigo-100 to-transparent"
          }`}
        />
      </div>
    </section>
  );
}
