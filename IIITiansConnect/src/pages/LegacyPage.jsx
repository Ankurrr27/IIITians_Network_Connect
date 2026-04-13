import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import useThemeMode from "../hooks/useThemeMode.jsx";
import { useSearchParams } from "react-router-dom";
import ImageCropModal from "../components/ImageCropModal";
import { notifyAppAction, notifyPageEntry } from "../utils/appNotifications";
import { cardShell, initialForm } from "./legacy/constants.js";
import LegacyEntriesSection from "./legacy/LegacyEntriesSection.jsx";
import LegacyFiltersSection from "./legacy/LegacyFiltersSection.jsx";
import LegacyHeroSection from "./legacy/LegacyHeroSection.jsx";
import LegacySubmissionSection from "./legacy/LegacySubmissionSection.jsx";
import { getLegacyStats, normalizeCollegeName } from "./legacy/utils.js";

export default function LegacyPage() {
  const { isDarkMode } = useThemeMode();
  const [searchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [generationFilter, setGenerationFilter] = useState(
    searchParams.get("generation") || ""
  );
  const [iiitFilter, setIiitFilter] = useState(searchParams.get("iiit") || "");
  const [professionalStatusFilter, setProfessionalStatusFilter] = useState(
    searchParams.get("professionalStatus") || ""
  );
  const [legacyTypeFilter, setLegacyTypeFilter] = useState(
    searchParams.get("legacyType") || ""
  );
  const [networkPostFilter, setNetworkPostFilter] = useState(
    searchParams.get("networkPost") || ""
  );
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [form, setForm] = useState(initialForm);
  const [teamMembers, setTeamMembers] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [rawPhoto, setRawPhoto] = useState(null);
  const [useTeamPhoto, setUseTeamPhoto] = useState(true);

  const filteredEntries = useMemo(() => {
    const queryIiit = searchParams.get("iiit");
    const normalizedQuery = queryIiit ? normalizeCollegeName(queryIiit) : null;

    if (!normalizedQuery) return entries;

    return entries.filter((entry) => {
      const memberCollege = normalizeCollegeName(entry.iiit);
      return memberCollege === normalizedQuery;
    });
  }, [entries, searchParams]);

  const fetchEntries = async (filters = {}) => {
    setLoading(true);

    try {
      const response = await api.get("/alumni", {
        params: {
          search: filters.search ?? search,
          generation: filters.generation ?? generationFilter,
          iiit: filters.iiit ?? iiitFilter,
          professionalStatus:
            filters.professionalStatus ?? professionalStatusFilter,
          legacyType: filters.legacyType ?? legacyTypeFilter,
          networkPost: filters.networkPost ?? networkPostFilter,
        },
      });

      setEntries(response.data);
      setApiUnavailable(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setApiUnavailable(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get("/team");
      setTeamMembers(response.data || []);
    } catch {
      setTeamMembers([]);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await api.get("/colleges");
      const names = (response.data || [])
        .map((college) => college?.name)
        .filter(Boolean);
      setCollegeOptions(names);
    } catch {
      setCollegeOptions([]);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchColleges();
    notifyPageEntry(
      "Congratulations, legacy page loaded",
      "Network Legacy is ready to explore.",
      "page-legacy-loaded"
    );
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setGenerationFilter(searchParams.get("generation") || "");
    setIiitFilter(searchParams.get("iiit") || "");
    setProfessionalStatusFilter(searchParams.get("professionalStatus") || "");
    setLegacyTypeFilter(searchParams.get("legacyType") || "");
    setNetworkPostFilter(searchParams.get("networkPost") || "");
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEntries({ search, generation: generationFilter });
    }, 250);

    return () => clearTimeout(timeout);
  }, [
    search,
    generationFilter,
    iiitFilter,
    professionalStatusFilter,
    legacyTypeFilter,
    networkPostFilter,
  ]);

  const generationOptions = useMemo(() => {
    const values = entries.map((entry) => entry.generation).filter(Boolean);
    return [...new Set(values)].sort((a, b) => b.localeCompare(a));
  }, [entries]);

  const matchedTeamMember = useMemo(() => {
    const normalizedEmail = form.email.trim().toLowerCase();
    if (!normalizedEmail) return null;

    return (
      [...teamMembers]
        .filter(
          (member) => (member.email || "").trim().toLowerCase() === normalizedEmail
        )
        .sort((a, b) =>
          String(b.year || "").localeCompare(String(a.year || ""), undefined, {
            numeric: true,
          })
        )[0] || null
    );
  }, [form.email, teamMembers]);

  const iiitOptions = useMemo(() => {
    const values = [
      ...entries.map((entry) => entry.iiit).filter(Boolean),
      ...collegeOptions,
    ];
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [entries, collegeOptions]);

  const networkPostOptions = useMemo(() => {
    const values = entries.map((entry) => entry.networkPost).filter(Boolean);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const stats = useMemo(() => getLegacyStats(entries), [entries]);

  const filterSelectClass = `w-full appearance-none rounded-2xl border px-4 py-3 pr-12 text-sm outline-none transition duration-300 truncate sm:text-base ${
    isDarkMode
      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
      : "border-slate-200 bg-white/90 text-slate-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
  }`;

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitState.loading) return;

    setSubmitState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, key === "graduationYear" ? Number(value) : value);
      });

      if (photo) {
        formData.append("photo", photo);
      } else if (useTeamPhoto && matchedTeamMember?._id) {
        formData.append("photoSourceMemberId", matchedTeamMember._id);
      }

      await api.post("/alumni", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm(initialForm);
      setPhoto(null);
      setRawPhoto(null);
      setUseTeamPhoto(true);
      setIsFormOpen(false);
      setSubmitState({
        loading: false,
        error: "",
        success:
          "Your Network Legacy request has been submitted. It will appear after admin approval.",
      });
      notifyAppAction({
        title: "Congratulations, form submitted successfully",
        message: "Your Network Legacy profile request has been sent.",
        type: "legacy",
        dedupeKey: "legacy-form-submit",
      });
      setApiUnavailable(false);
      fetchEntries();
    } catch (error) {
      const notDeployed = error.response?.status === 404;

      if (notDeployed) {
        setApiUnavailable(true);
      }

      setSubmitState({
        loading: false,
        success: "",
        error: notDeployed
          ? "The Network Legacy API is not live on the backend yet. Redeploy the backend service first."
          : error.response?.data?.message ||
            "Could not save your details right now.",
      });
    }
  };

  return (
    <div
      className={`relative min-h-screen ${
        isDarkMode
          ? "bg-slate-950"
          : "bg-[linear-gradient(180deg,_#eff6ff_0%,_#f8faff_40%,_#ffffff_100%)]"
      } pb-16 pt-20 text-slate-900 sm:pb-24 sm:pt-24`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />

      <LegacyHeroSection isDarkMode={isDarkMode} stats={stats} />

      <section className="px-4 pb-14 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          {apiUnavailable && (
            <div
              className={`rounded-[1.5rem] border px-4 py-3 text-sm leading-7 sm:px-5 sm:py-4 ${
                isDarkMode
                  ? "border-amber-900 bg-amber-950/40 text-amber-200"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              The deployed backend does not have `/api/alumni` live yet. Redeploy the
              backend before testing the Network Legacy page fully.
            </div>
          )}

          {submitState.error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitState.error}
            </div>
          )}

          {submitState.success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {submitState.success}
            </div>
          )}

          <LegacySubmissionSection
            isDarkMode={isDarkMode}
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
            handleSubmit={handleSubmit}
            submitState={submitState}
            form={form}
            handleChange={handleChange}
            iiitOptions={iiitOptions}
            matchedTeamMember={matchedTeamMember}
            photo={photo}
            setRawPhoto={setRawPhoto}
            useTeamPhoto={useTeamPhoto}
            setUseTeamPhoto={setUseTeamPhoto}
          />

          <div
            className={`overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_22px_60px_rgba(99,102,241,0.08)] sm:rounded-[2rem] sm:p-6 lg:p-7 ${
              isDarkMode
                ? cardShell.dark
                : "border-indigo-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.9),rgba(255,255,255,0.95))]"
            }`}
          >
            <LegacyFiltersSection
              isDarkMode={isDarkMode}
              search={search}
              setSearch={setSearch}
              areFiltersOpen={areFiltersOpen}
              setAreFiltersOpen={setAreFiltersOpen}
              generationFilter={generationFilter}
              setGenerationFilter={setGenerationFilter}
              iiitFilter={iiitFilter}
              setIiitFilter={setIiitFilter}
              professionalStatusFilter={professionalStatusFilter}
              setProfessionalStatusFilter={setProfessionalStatusFilter}
              legacyTypeFilter={legacyTypeFilter}
              setLegacyTypeFilter={setLegacyTypeFilter}
              networkPostFilter={networkPostFilter}
              setNetworkPostFilter={setNetworkPostFilter}
              generationOptions={generationOptions}
              iiitOptions={iiitOptions}
              networkPostOptions={networkPostOptions}
              filterSelectClass={filterSelectClass}
            />
          </div>

          <LegacyEntriesSection
            isDarkMode={isDarkMode}
            loading={loading}
            entries={filteredEntries}
          />
        </div>
      </section>

      {rawPhoto && (
        <ImageCropModal
          file={rawPhoto}
          aspect={1}
          onClose={() => setRawPhoto(null)}
          onCrop={(croppedFile) => {
            setPhoto(croppedFile);
            setRawPhoto(null);
          }}
        />
      )}
    </div>
  );
}
