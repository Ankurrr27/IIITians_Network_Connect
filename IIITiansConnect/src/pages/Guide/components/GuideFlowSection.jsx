import { ArrowRight, CheckCircle2 } from "lucide-react";
import GuideMockup from "./GuideMockup";

export default function GuideFlowSection({
  eyebrow,
  title,
  description,
  steps,
  note,
  variant,
}) {
  return (
    <section className="grid gap-6 rounded-[2rem] bg-white/90 p-4 shadow-[0_24px_70px_-38px_rgba(79,70,229,0.18)] sm:p-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 lg:p-7">
      <div className="order-2 lg:order-1">
        <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
          {eyebrow}
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>

        <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white sm:h-9 sm:w-9">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 sm:text-base">
                    <span>{step.title}</span>
                    <ArrowRight className="h-4 w-4 text-indigo-400" />
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {step.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {note && (
          <div className="mt-6 flex items-start gap-3 rounded-[1.4rem] border border-emerald-100 bg-emerald-50/70 p-4 text-sm leading-7 text-emerald-900">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
            <p>{note}</p>
          </div>
        )}
      </div>

      <div className="order-1 flex items-center lg:order-2 lg:pl-1">
        <GuideMockup variant={variant} />
      </div>
    </section>
  );
}

function DiagramCard({ title, items }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-100"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
