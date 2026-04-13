import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { cardShell, legacyFormFields } from "./constants.js";

export default function LegacySubmissionSection({
  isDarkMode,
  isFormOpen,
  setIsFormOpen,
  handleSubmit,
  submitState,
  form,
  handleChange,
  iiitOptions,
  matchedTeamMember,
  photo,
  setRawPhoto,
  useTeamPhoto,
  setUseTeamPhoto,
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_22px_60px_rgba(99,102,241,0.08)] sm:rounded-[2rem] sm:p-6 lg:p-7 ${
        isDarkMode
          ? cardShell.dark
          : "border-indigo-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.9),rgba(255,255,255,0.95))]"
      }`}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
        <div className="max-w-2xl">
          <h2
            className={`text-xl font-semibold sm:text-2xl ${
              isDarkMode ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Add your Network Legacy profile
          </h2>
          <p
            className={`mt-2 text-sm leading-6 sm:leading-7 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Send your profile for review. Only approved entries are shown in the
            public legacy page.
          </p>
          <Link
            to="/guide"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            Need help? Open Guide
          </Link>
        </div>

        <div className="flex items-center justify-start lg:justify-end">
          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="inline-flex min-w-[11rem] items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#4f46e5,#6366f1)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(99,102,241,0.28)] transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_24px_44px_rgba(99,102,241,0.34)] active:scale-[0.99]"
          >
            {isFormOpen ? "Close form" : "Open form"}
            {isFormOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {legacyFormFields.map(([name, label, placeholder, type, required, span]) => (
              <label key={name} className={`flex flex-col gap-2 ${span}`}>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {label}
                  {required ? " *" : ""}
                </span>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={required}
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  }`}
                />
              </label>
            ))}

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Institute *
              </span>
              <input
                name="iiit"
                list="legacy-iiit-options"
                type="text"
                value={form.iiit}
                onChange={handleChange}
                placeholder="Choose or type an IIIT, e.g. IIIT Kota"
                required
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                    : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                }`}
              />
              <datalist id="legacy-iiit-options">
                {iiitOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
              <p className="mt-2 text-xs text-slate-500">
                Pick from the existing IIIT list if available so your profile is easier to
                group correctly.
              </p>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Legacy message / bio
              </span>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="e.g. I worked across social media and leadership in IIITians Network, and now I am focused on building stronger student communities."
                rows={4}
                className={`rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                    : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                }`}
              />
            </label>
          </div>

          <div
            className={`rounded-2xl border p-4 max-sm:border-transparent max-sm:bg-transparent max-sm:px-0 max-sm:py-1 ${
              isDarkMode
                ? "border-slate-700 bg-slate-950"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  Legacy photo
                </p>
                <p
                  className={`mt-1 text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Upload a photo, or reuse your team photo if you already appear on the
                  team page.
                </p>
              </div>

              <label
                htmlFor="legacy-photo-upload"
                className="inline-flex cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
              >
                {photo ? "Replace photo" : "Upload photo"}
              </label>
            </div>

            <input
              id="legacy-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const nextFile = event.target.files?.[0];
                if (nextFile) {
                  setRawPhoto(nextFile);
                  setUseTeamPhoto(false);
                }
                event.target.value = "";
              }}
            />

            {matchedTeamMember?.photo?.url && (
              <label
                className={`mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                  isDarkMode ? "bg-slate-900 text-slate-300" : "bg-white text-slate-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={useTeamPhoto && !photo}
                  onChange={(event) => setUseTeamPhoto(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Use same photo as your team profile
                <span className="font-medium text-indigo-600">
                  {matchedTeamMember.name}
                </span>
              </label>
            )}

            {(photo || (useTeamPhoto && matchedTeamMember?.photo?.url)) && (
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={photo ? URL.createObjectURL(photo) : matchedTeamMember.photo.url}
                  alt="Legacy profile preview"
                  className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
                />
                <div className="text-sm text-slate-600">
                  {photo ? "Cropped photo ready for upload" : "Using existing team photo"}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitState.loading}
            className="w-full rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#6366f1)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(99,102,241,0.24)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_44px_rgba(99,102,241,0.3)] hover:brightness-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {submitState.loading ? "Submitting..." : "Send legacy request"}
          </button>
        </form>
      )}

      <div
        className={`my-6 h-px ${
          isDarkMode
            ? "bg-gradient-to-r from-transparent via-slate-700 to-transparent"
            : "bg-gradient-to-r from-transparent via-indigo-100 to-transparent"
        }`}
      />
    </div>
  );
}
