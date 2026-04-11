import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Milestone,
  Users,
} from "lucide-react";
import api from "../api/axios";
import useThemeMode from "../hooks/useThemeMode.jsx";
import { Link, useSearchParams } from "react-router-dom";
import ImageCropModal from "../components/ImageCropModal";

const initialForm = {
  name: "",
  email: "",
  iiit: "",
  graduationYear: "",
  generation: "",
  branch: "",
  networkPost: "",
  currentRole: "",
  currentCompany: "",
  location: "",
  linkedin: "",
  instagram: "",
  bio: "",
};

const cardShell = {
  light:
    "border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]",
  dark:
    "border-slate-800 bg-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.26)]",
};

const normalizeText = (value = "") => value.trim().toLowerCase();

const normalizeCollegeName = (name) => {
  let n = (name || "").trim().toLowerCase();
  if (
    n.includes("sricity") ||
    n.includes("sri city") ||
    n === "chittoor" ||
    (n.includes("iiit") && n.includes("chittoor"))
  ) {
    return "iiit sricity_chittoor_canonical";
  }
  return n;
};

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

  const filteredEntries = useMemo(() => {
    const queryIiit = searchParams.get("iiit");
    const normalizedQuery = queryIiit ? normalizeCollegeName(queryIiit) : null;

    if (!normalizedQuery) return entries;

    return entries.filter((entry) => {
      const memberCollege = normalizeCollegeName(entry.iiit);
      return memberCollege === normalizedQuery;
    });
  }, [entries, searchParams]);
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
        .filter((member) => (member.email || "").trim().toLowerCase() === normalizedEmail)
        .sort((a, b) => String(b.year || "").localeCompare(String(a.year || ""), undefined, { numeric: true }))[0] ||
      null
    );
  }, [form.email, teamMembers]);

  const iiitOptions = useMemo(() => {
    const values = [...entries.map((entry) => entry.iiit).filter(Boolean), ...collegeOptions];
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [entries, collegeOptions]);

  const networkPostOptions = useMemo(() => {
    const values = entries.map((entry) => entry.networkPost).filter(Boolean);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const stats = useMemo(
    () => [
      { label: "Legacy profiles", value: entries.length, icon: Users },
      {
        label: "Network posts",
        value: new Set(entries.map((entry) => entry.networkPost).filter(Boolean)).size,
        icon: ShieldCheck,
      },
      {
        label: "Companies listed",
        value: new Set(entries.map((entry) => entry.currentCompany).filter(Boolean)).size,
        icon: Building2,
      },
      {
        label: "Batches visible",
        value: new Set(entries.map((entry) => entry.generation).filter(Boolean)).size,
        icon: GraduationCap,
      },
    ],
    [entries]
  );

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
      {/* Radial Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />

      <section className="relative z-10 px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6">
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
                <div className={`inline-flex items-center gap-2 rounded-full border ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/90 text-indigo-700 border-indigo-100 shadow-sm'} px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]`}>
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
              The deployed backend does not have `/api/alumni` live yet. Redeploy
              the backend before testing the Network Legacy page fully.
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
                  Send your profile for review. Only approved entries are shown
                  in the public legacy page.
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
                  {[
                    ["name", "Full name", "e.g. Ankur Singh", "text", true, ""],
                    ["email", "Email address", "e.g. ankur@email.com", "email", true, ""],
                    ["generation", "Team term or batch", "e.g. 2024-28 or 2021-25", "text", true, ""],
                    ["graduationYear", "Graduation year", "e.g. 2028", "number", true, ""],
                    ["branch", "Branch", "e.g. CSE", "text", true, ""],
                    ["networkPost", "Latest network post", "e.g. Vice President", "text", false, ""],
                    ["currentRole", "Current role / designation", "e.g. Product Designer Intern", "text", false, ""],
                    ["currentCompany", "Current company / organization", "e.g. Adobe / Freelance", "text", false, ""],
                    ["location", "Current location", "e.g. Bengaluru, India", "text", false, ""],
                    ["linkedin", "LinkedIn profile URL", "e.g. https://linkedin.com/in/ankur-singh", "text", false, "sm:col-span-2"],
                    ["instagram", "Instagram profile URL", "e.g. https://instagram.com/ankurwrites", "text", false, "sm:col-span-2"],
                  ].map(([name, label, placeholder, type, required, span]) => (
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
                    <p className={`mt-2 text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                      Pick from the existing IIIT list if available so your profile is easier to group correctly.
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
                  className={`rounded-2xl border p-4 ${
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
                        Upload a photo, or reuse your team photo if you already appear on the team page.
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
          </div>

          <div
            className={`rounded-[1.75rem] border p-5 shadow-[0_20px_50px_rgba(148,163,184,0.1)] sm:p-6 lg:p-7 ${
              isDarkMode
                ? cardShell.dark
                : "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.92))]"
            }`}
          >
            <div className="max-w-2xl pb-5">
              <h2
                className={`text-xl font-semibold sm:text-2xl ${
                  isDarkMode ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Search Network Legacy
              </h2>
              <p
                className={`mt-1 text-sm ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Filter by name, batch, network post, professional role,
                company, or institute.
              </p>
            </div>

            <div
              className={`rounded-[1.5rem] border p-4 sm:p-5 ${
                isDarkMode
                  ? "border-slate-800 bg-slate-950/50"
                  : "border-slate-200 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
              }`}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try: Ankur, Vice President, Adobe, CSE, or IIIT Surat"
                  className={`w-full rounded-2xl border px-11 py-3 text-sm outline-none transition duration-300 placeholder:text-slate-500 sm:text-base ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-slate-200 bg-white/90 text-slate-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  }`}
                />
              </label>

              <div className="relative">
                <select
                  value={generationFilter}
                  onChange={(event) => setGenerationFilter(event.target.value)}
                  title={generationFilter || "All generations"}
                  className={filterSelectClass}
                >
                  <option value="">All generations</option>
                  {generationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <select
                  value={iiitFilter}
                  onChange={(event) => setIiitFilter(event.target.value)}
                  title={iiitFilter || "All institutes"}
                  className={filterSelectClass}
                >
                  <option value="">All institutes</option>
                  {iiitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <select
                  value={professionalStatusFilter}
                  onChange={(event) =>
                    setProfessionalStatusFilter(event.target.value)
                  }
                  title={
                    professionalStatusFilter === "working"
                      ? "Working professionals"
                      : professionalStatusFilter === "open"
                      ? "Open to next move"
                      : "All professional stages"
                  }
                  className={filterSelectClass}
                >
                  <option value="">All professional stages</option>
                  <option value="working">Working professionals</option>
                  <option value="open">Open to next move</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_12rem]">
                <div className="relative">
                  <select
                    value={legacyTypeFilter}
                    onChange={(event) => setLegacyTypeFilter(event.target.value)}
                    title={
                      legacyTypeFilter === "team_member"
                        ? "Team members"
                        : legacyTypeFilter === "alumni"
                        ? "Submitted alumni"
                        : "All legacy types"
                    }
                    className={filterSelectClass}
                  >
                    <option value="">All legacy types</option>
                    <option value="team_member">Team members</option>
                    <option value="alumni">Submitted alumni</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="relative">
                  <select
                    value={networkPostFilter}
                    onChange={(event) => setNetworkPostFilter(event.target.value)}
                    title={networkPostFilter || "All network posts"}
                    className={filterSelectClass}
                  >
                    <option value="">All network posts</option>
                    {networkPostOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setGenerationFilter("");
                    setIiitFilter("");
                    setProfessionalStatusFilter("");
                    setLegacyTypeFilter("");
                    setNetworkPostFilter("");
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 sm:text-base ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-900"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md"
                  }`}
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {loading ? (
              <div className="grid gap-4 sm:gap-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`animate-pulse overflow-hidden rounded-[1.5rem] border sm:rounded-[2rem] ${
                      isDarkMode ? cardShell.dark : cardShell.light
                    }`}
                  >
                    <div className="flex flex-col lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
                      <div className="h-64 bg-slate-200 sm:h-72 lg:h-[22rem]" />
                      <div className="space-y-5 p-4 sm:p-6 lg:p-7">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="h-10 w-2/3 rounded-2xl bg-slate-200" />
                            <div className="flex flex-wrap gap-2">
                              <div className="h-9 w-28 rounded-full bg-slate-100" />
                              <div className="h-9 w-24 rounded-full bg-slate-100" />
                              <div className="h-9 w-32 rounded-full bg-slate-100" />
                            </div>
                          </div>
                          <div className="h-24 w-full rounded-[1.4rem] bg-slate-100 md:w-52" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded bg-slate-100" />
                          <div className="h-4 w-5/6 rounded bg-slate-100" />
                          <div className="h-4 w-3/4 rounded bg-slate-100" />
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <div className="h-4 w-32 rounded bg-slate-200" />
                          <div className="mt-3 flex flex-wrap gap-2">
                            <div className="h-8 w-40 rounded-full bg-white" />
                            <div className="h-8 w-36 rounded-full bg-white" />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="h-5 w-16 rounded bg-slate-100" />
                          <div className="h-5 w-20 rounded bg-slate-100" />
                          <div className="h-5 w-20 rounded bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div
                className={`rounded-[1.5rem] border border-dashed p-6 text-center sm:rounded-[2rem] sm:p-8 ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
                    : "border-slate-300 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
                }`}
              >
                <h3
                  className={`text-lg font-semibold sm:text-xl ${
                    isDarkMode ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  No legacy profiles match this search yet
                </h3>
                <p
                  className={`mt-2 text-sm leading-7 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Try another search term or open the form above to submit a
                  new profile request.
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const companyValue =
                  entry.currentCompany || entry.company || entry.organisation || "";
                const locationValue =
                  entry.location || entry.currentLocation || entry.city || "";
                const normalizedNetworkPost = normalizeText(entry.networkPost);
                const normalizedCurrentRole = normalizeText(entry.currentRole);
                const normalizedCurrentCompany = normalizeText(companyValue);
                const normalizedIiit = normalizeText(entry.iiit);
                const normalizedLocation = normalizeText(locationValue);
                const showRoleChip =
                  entry.currentRole &&
                  normalizedCurrentRole !== normalizedNetworkPost;
                const showCompanyChip =
                  companyValue &&
                  normalizedCurrentCompany !== normalizedIiit;
                const showLocationChip =
                  locationValue &&
                  normalizedLocation !== normalizedIiit &&
                  normalizedLocation !== normalizedCurrentCompany;
                const dedupedRoleHistory = (entry.roleHistory || []).filter(
                  (item, index, list) => {
                    const signature = `${normalizeText(item.year || "")}|${normalizeText(
                      item.team || ""
                    )}|${normalizeText(item.role || "")}`;
                    return (
                      index ===
                      list.findIndex((candidate) => {
                        const candidateSignature = `${normalizeText(
                          candidate.year || ""
                        )}|${normalizeText(candidate.team || "")}|${normalizeText(
                          candidate.role || ""
                        )}`;
                        return candidateSignature === signature;
                      })
                    );
                  }
                );

                return (
                  <article
                    key={entry._id}
                    className={`overflow-hidden rounded-[1.5rem] border transition sm:rounded-[2rem] ${
                      isDarkMode ? cardShell.dark : cardShell.light
                    }`}
                  >
                    <div className="flex flex-col lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
                      {entry.photo?.url ? (
                      <div className="relative h-64 overflow-hidden sm:h-72 lg:h-[22rem]">
                        <img
                          src={entry.photo.url}
                          alt={entry.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700 backdrop-blur sm:text-xs">
                            {entry.generation}
                          </span>
                        </div>
                      </div>
                      ) : (
                      <div
                        className={`flex min-h-[16rem] items-end p-5 sm:min-h-[18rem] lg:min-h-[22rem] ${
                          isDarkMode
                            ? "bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950"
                            : "bg-gradient-to-br from-indigo-100 via-indigo-50 to-white"
                        }`}
                      >
                        <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700 shadow-sm sm:text-xs">
                          {entry.generation}
                        </span>
                      </div>
                      )}

                      <div className="p-4 sm:p-6 lg:p-7">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <h3
                              className={`text-2xl font-semibold sm:text-[2rem] ${
                                isDarkMode ? "text-slate-100" : "text-slate-900"
                              }`}
                            >
                              {entry.name}
                            </h3>

                            <div
                              className={`mt-3 flex flex-wrap gap-2 text-sm ${
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              {entry.networkPost && (
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                                    isDarkMode ? "bg-slate-800" : "bg-indigo-50"
                                  }`}
                                >
                                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                                  {entry.networkPost}
                                </span>
                              )}

                              {showRoleChip && (
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                                    isDarkMode ? "bg-slate-800" : "bg-slate-100"
                                  }`}
                                >
                                  <Briefcase className="h-4 w-4 text-indigo-600" />
                                  {entry.currentRole}
                                </span>
                              )}

                              {showCompanyChip && (
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                                    isDarkMode ? "bg-slate-800" : "bg-slate-100"
                                  }`}
                                >
                                  <Building2 className="h-4 w-4 text-indigo-600" />
                                  {companyValue}
                                </span>
                              )}

                              {showLocationChip && (
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                                    isDarkMode ? "bg-slate-800" : "bg-slate-100"
                                  }`}
                                >
                                  <MapPin className="h-4 w-4 text-indigo-600" />
                                  {locationValue}
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            className={`rounded-[1.4rem] px-4 py-3 text-sm sm:min-w-[13rem] ${
                              isDarkMode
                                ? "bg-slate-800 text-indigo-200"
                                : "bg-indigo-50 text-indigo-900"
                            }`}
                          >
                            <div className="font-semibold">{entry.iiit}</div>
                            <div>{entry.branch}</div>
                          <div>
                            {entry.legacyType === "team_member"
                              ? `Team term ${entry.generation}`
                              : `Class of ${entry.graduationYear}`}
                            </div>
                          </div>
                        </div>

                        {entry.bio && (
                          <p
                            className={`mt-5 text-sm leading-7 sm:text-[15px] ${
                              isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {entry.bio}
                          </p>
                        )}

                        {dedupedRoleHistory.length > 0 && (
                          <div
                            className={`mt-5 rounded-[1.5rem] border p-3 sm:p-4 ${
                              isDarkMode
                                ? "border-slate-800 bg-slate-950/50"
                                : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <div
                              className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              <Milestone className="h-4 w-4 text-indigo-600" />
                              Network Journey
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {dedupedRoleHistory.map((item, index) => (
                                <div
                                  key={`${item.year}-${item.team}-${item.role}-${index}`}
                                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                    isDarkMode
                                      ? "bg-slate-800 text-slate-200"
                                      : "bg-white text-slate-700 ring-1 ring-slate-200"
                                  }`}
                                >
                                  {item.year ? `${item.year}: ` : ""}
                                  {item.role}
                                  {item.team ? ` (${item.team})` : ""}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-4 text-sm">
                          <a
                            href={`mailto:${entry.email}`}
                            className="inline-flex items-center gap-2 font-medium text-indigo-600 transition hover:text-indigo-500"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </a>

                          {entry.linkedin && (
                            <a
                              href={entry.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 font-medium text-indigo-600 transition hover:text-indigo-500"
                            >
                              <Linkedin className="h-4 w-4" />
                              LinkedIn
                            </a>
                          )}

                          {entry.instagram && (
                            <a
                              href={entry.instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 font-medium text-indigo-600 transition hover:text-indigo-500"
                            >
                              <Instagram className="h-4 w-4" />
                              Instagram
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
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
