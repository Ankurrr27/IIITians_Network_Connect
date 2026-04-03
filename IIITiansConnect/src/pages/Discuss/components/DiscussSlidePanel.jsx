import { X } from "lucide-react";

export default function DiscussSlidePanel({ open, title, onClose, children }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 transition ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xl transform border-l border-sky-100 bg-[linear-gradient(180deg,_#f8fbff_0%,_#eef7ff_100%)] shadow-2xl transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sky-100 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-slate-600 transition hover:bg-sky-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        </div>
      </aside>
    </>
  );
}
