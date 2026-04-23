import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const filters = [
  { label: "All Profiles", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const getEffectiveStatus = (entry) => entry.status || "approved";

const mergeEntries = (...groups) => {
  const map = new Map();

  groups.flat().forEach((entry) => {
    if (!entry?._id) return;

    const existing = map.get(entry._id) || {};
    map.set(entry._id, {
      ...existing,
      ...entry,
      status: entry.status ?? existing.status ?? "approved",
    });
  });

  return Array.from(map.values());
};

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900 sm:px-5 sm:py-4">
      <div className="font-semibold">{label}</div>
      <div className="mt-1 text-2xl font-semibold sm:text-3xl">{value}</div>
    </div>
  );
}

export default function LegacyAdminPage() {
  const navigate = useNavigate();
  const { status: routeStatus } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [editEntryId, setEditEntryId] = useState("");
  const [teamEntryId, setTeamEntryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    iiit: "",
    generation: "",
    graduationYear: "",
    branch: "",
    networkPost: "",
    currentRole: "",
    currentCompany: "",
    location: "",
    linkedin: "",
    instagram: "",
    bio: "",
  });
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    roleType: "MEMBER",
    iiit: "",
    email: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    currentCompany: "",
    location: "",
    aboutText: "",
    messageText: "",
    team: "Core",
    year: "",
    order: 0,
  });
  const status = filters.some((filter) => filter.value === routeStatus)
    ? routeStatus
    : "all";

  const loadEntries = async (nextStatus = status, nextQuery = query) => {
    setLoading(true);
    setError("");

    try {
      const [adminResult, publicResult] = await Promise.allSettled([
        api.get("/alumni/admin/requests", {
          params: {
            status: nextStatus,
            search: nextQuery,
          },
        }),
        api.get("/alumni", {
          params: {
            search: nextQuery,
          },
        }),
      ]);

      const adminEntries =
        adminResult.status === "fulfilled" ? adminResult.value.data : [];
      const publicEntries =
        publicResult.status === "fulfilled" ? publicResult.value.data : [];

      const merged = mergeEntries(adminEntries, publicEntries);
      const filtered =
        nextStatus === "all"
          ? merged
          : merged.filter(
              (entry) => getEffectiveStatus(entry) === nextStatus
            );

      setEntries(filtered);

      if (
        adminResult.status === "rejected" &&
        publicResult.status === "fulfilled"
      ) {
        setError(
          "Admin-only data could not be loaded, so only public Network Legacy profiles are shown."
        );
      } else if (
        publicResult.status === "rejected" &&
        adminResult.status === "fulfilled"
      ) {
        setError(
          "Public fallback data could not be loaded, so only admin Network Legacy data is shown."
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not load Network Legacy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEntries(status, query);
    }, 250);

    return () => clearTimeout(timer);
  }, [status, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status, query]);

  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const paginatedEntries = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    const pending = entries.filter(
      (entry) => getEffectiveStatus(entry) === "pending"
    ).length;
    const approved = entries.filter(
      (entry) => getEffectiveStatus(entry) === "approved"
    ).length;
    const rejected = entries.filter(
      (entry) => getEffectiveStatus(entry) === "rejected"
    ).length;

    return {
      total: entries.length,
      pending,
      approved,
      rejected,
    };
  }, [entries]);

  const handleStatusChange = async (id, nextStatus) => {
    setBusyId(id);
    setError("");

    try {
      const response = await api.patch(`/alumni/${id}/status`, {
        status: nextStatus,
      });

      setEntries((prev) =>
        prev.map((entry) => (entry._id === id ? response.data : entry))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update profile status."
      );
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this Network Legacy profile permanently?"
    );
    if (!confirmed) return;

    setBusyId(id);
    setError("");

    try {
      await api.delete(`/alumni/${id}`);
      setEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete profile.");
    } finally {
      setBusyId("");
    }
  };

  const startEdit = (entry) => {
    setEditEntryId(entry._id);
    setEditForm({
      name: entry.name || "",
      email: entry.email || "",
      iiit: entry.iiit || "",
      generation: entry.generation || "",
      graduationYear: entry.graduationYear || "",
      branch: entry.branch || "",
      networkPost: entry.networkPost || "",
      currentRole: entry.currentRole || "",
      currentCompany: entry.currentCompany || "",
      location: entry.location || "",
      linkedin: entry.linkedin || "",
      instagram: entry.instagram || "",
      bio: entry.bio || "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditEntryId("");
    setEditForm({
      name: "",
      email: "",
      iiit: "",
      generation: "",
      graduationYear: "",
      branch: "",
      networkPost: "",
      currentRole: "",
      currentCompany: "",
      location: "",
      linkedin: "",
      instagram: "",
      bio: "",
    });
    setError("");
  };

  const handleEditChange = (event) => {
    setEditForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const startAddToTeam = (entry) => {
    setTeamEntryId(entry._id);
    setTeamForm({
      name: entry.name || "",
      role: entry.networkPost || entry.currentRole || "",
      roleType: "MEMBER",
      iiit: entry.iiit || "",
      email: entry.email || "",
      linkedin: entry.linkedin || "",
      instagram: entry.instagram || "",
      twitter: entry.twitter || "",
      currentCompany: entry.currentCompany || "",
      location: entry.location || "",
      aboutText: entry.bio || "",
      messageText: entry.bio || "",
      team: "Core",
      year: entry.generation || "",
      order: 0,
    });
    setError("");
  };

  const cancelAddToTeam = () => {
    setTeamEntryId("");
    setTeamForm({
      name: "",
      role: "",
      roleType: "MEMBER",
      iiit: "",
      email: "",
      linkedin: "",
      instagram: "",
      twitter: "",
      currentCompany: "",
      location: "",
      aboutText: "",
      messageText: "",
      team: "Core",
      year: "",
      order: 0,
    });
  };

  const handleTeamFormChange = (event) => {
    setTeamForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddToTeam = async (entry) => {
    setBusyId(entry._id);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(teamForm).forEach(([key, value]) =>
        formData.append(key, value)
      );

      if (entry.photo?.url) {
        formData.append("photoSourceAlumniId", entry._id);
      }

      await api.post("/team", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      cancelAddToTeam();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Could not add this legacy profile into team history."
      );
    } finally {
      setBusyId("");
    }
  };

  const handleSaveEdit = async (id) => {
    setBusyId(id);
    setError("");

    try {
      const response = await api.patch(`/alumni/admin/${id}`, {
        ...editForm,
        graduationYear: Number(editForm.graduationYear),
      });

      setEntries((prev) =>
        prev.map((entry) =>
          entry._id === id ? response.data.alumni || response.data : entry
        )
      );
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Network Legacy moderation
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Manage legacy requests and published profiles
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Review submissions, update profile status, and delete older legacy
              entries from one compact admin page.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Total in view" value={stats.total} />
            <StatCard label="Pending" value={stats.pending} />
            <StatCard label="Approved" value={stats.approved} />
            <StatCard label="Rejected" value={stats.rejected} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, post, company, role, branch, or IIIT"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base"
            />
          </label>

          <div className="flex overflow-x-auto gap-2 pb-2 -mb-2 custom-scrollbar sm:flex-wrap sm:pb-0 sm:mb-0">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  navigate(
                    filter.value === "all"
                      ? "/legacy/admin"
                      : `/legacy/admin/${filter.value}`
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  status === filter.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-14 text-center text-slate-500 shadow-sm sm:rounded-[2rem] sm:py-16">
          Loading Network Legacy...
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm sm:rounded-[2rem] sm:py-16">
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
            No Network Legacy profiles found
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Try another filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {paginatedEntries.map((entry) => {
            const effectiveStatus = getEffectiveStatus(entry);
            const isEditing = editEntryId === entry._id;
            const isAddingToTeam = teamEntryId === entry._id;

            return (
              <article
                key={entry._id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          ["name", "Name"],
                          ["email", "Email"],
                          ["iiit", "Institute"],
                          ["generation", "Generation / term"],
                          ["graduationYear", "Graduation year"],
                          ["branch", "Branch / team"],
                          ["networkPost", "Network post"],
                          ["currentRole", "Current role"],
                          ["currentCompany", "Current company"],
                          ["location", "Location"],
                          ["linkedin", "LinkedIn URL"],
                          ["instagram", "Instagram URL"],
                        ].map(([field, placeholder]) => (
                          <input
                            key={field}
                            type="text"
                            name={field}
                            value={editForm[field]}
                            onChange={handleEditChange}
                            placeholder={placeholder}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                          />
                        ))}
                        <div className="sm:col-span-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                          Legacy message:
                          <span className="ml-1 font-medium">
                            this is the public text shown on the Network Legacy card.
                            It stays part of legacy and should not be replaced when the person is later added to the team.
                          </span>
                        </div>
                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleEditChange}
                          placeholder="Legacy message shown on the public legacy card"
                          rows={4}
                          className="sm:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                            {entry.name}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                              effectiveStatus === "approved"
                                ? "bg-emerald-50 text-emerald-700"
                                : effectiveStatus === "rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {effectiveStatus}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                          {entry.networkPost && <p>Network post: {entry.networkPost}</p>}
                          {(entry.currentRole || entry.currentCompany) && (
                            <p>
                              {[entry.currentRole, entry.currentCompany]
                                .filter(Boolean)
                                .join(" at ")}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            {entry.iiit}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            {entry.branch}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            {entry.generation}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            {entry.legacyType === "team_member"
                              ? `Team term ${entry.generation}`
                              : `Class of ${entry.graduationYear}`}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 md:w-[220px]">
                    <div className="font-medium text-slate-900">
                      {isEditing ? editForm.email : entry.email}
                    </div>
                    <div className="mt-1">
                      {isEditing
                        ? editForm.location || "Location not shared"
                        : entry.location || "Location not shared"}
                    </div>
                    {(!isEditing ? entry.linkedin : editForm.linkedin) && (
                      <div className="mt-1">LinkedIn added</div>
                    )}
                    {(!isEditing ? entry.instagram : editForm.instagram) && (
                      <div className="mt-1">Instagram added</div>
                    )}
                    <div className="mt-1">
                      Submitted {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {!isEditing && entry.bio && (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {entry.bio}
                  </p>
                )}

                {isAddingToTeam && (
                  <div className="mt-5 rounded-[1.5rem] border border-indigo-100 bg-indigo-50/60 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Add this profile into team history
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Prefilled from legacy. Update role, team, and year
                          before saving.
                          {!entry.photo?.url
                            ? " This entry has no legacy photo, so add the same member later from Team Admin with a photo if needed."
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <input
                        name="name"
                        value={teamForm.name}
                        onChange={handleTeamFormChange}
                        placeholder="Name"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                      <input
                        name="role"
                        value={teamForm.role}
                        onChange={handleTeamFormChange}
                        placeholder="Role"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                      <select
                        name="roleType"
                        value={teamForm.roleType}
                        onChange={handleTeamFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      >
                        <option value="EXEC">Executive</option>
                        <option value="LEAD">Lead</option>
                        <option value="MEMBER">Member</option>
                      </select>
                      <select
                        name="team"
                        value={teamForm.team}
                        onChange={handleTeamFormChange}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      >
                        <option value="Core">Core</option>
                        <option value="Tech">Tech</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Content">Content</option>
                        <option value="Social Media">Social Media</option>
                      </select>
                      <input
                        name="year"
                        value={teamForm.year}
                        onChange={handleTeamFormChange}
                        placeholder="Team term"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                      <input
                        type="number"
                        name="order"
                        value={teamForm.order}
                        onChange={handleTeamFormChange}
                        placeholder="Display order"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                      <input
                        name="currentCompany"
                        value={teamForm.currentCompany}
                        onChange={handleTeamFormChange}
                        placeholder="Current company"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                      <input
                        name="location"
                        value={teamForm.location}
                        onChange={handleTeamFormChange}
                        placeholder="Location"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                      <textarea
                        name="aboutText"
                        value={teamForm.aboutText}
                        onChange={handleTeamFormChange}
                        placeholder="About text"
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                      <textarea
                        name="messageText"
                        value={teamForm.messageText}
                        onChange={handleTeamFormChange}
                        placeholder="Public message"
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={busyId === entry._id || !entry.photo?.url}
                        onClick={() => handleAddToTeam(entry)}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add to team
                      </button>
                      <button
                        type="button"
                        onClick={cancelAddToTeam}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        disabled={busyId === entry._id}
                        onClick={() => handleSaveEdit(entry._id)}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Pencil className="h-4 w-4" />
                        Save changes
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => startAddToTeam(entry)}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add to team
                      </button>
                      <button
                        type="button"
                        disabled={busyId === entry._id}
                        onClick={() => handleStatusChange(entry._id, "approved")}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={busyId === entry._id}
                        onClick={() => handleStatusChange(entry._id, "rejected")}
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>

                      {effectiveStatus !== "pending" && (
                        <button
                          type="button"
                          disabled={busyId === entry._id}
                          onClick={() => handleStatusChange(entry._id, "pending")}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Clock3 className="h-4 w-4" />
                          Move to pending
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={busyId === entry._id}
                        onClick={() => handleDelete(entry._id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
          >
            Previous
          </button>
          <div className="text-sm font-medium text-slate-400">
            Page <span className="text-slate-900 font-bold">{currentPage}</span> of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
