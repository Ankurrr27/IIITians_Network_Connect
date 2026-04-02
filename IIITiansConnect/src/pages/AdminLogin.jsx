import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import api from "../api/axios";
import useThemeMode from "../hooks/useThemeMode.jsx";

const initialCreateAdminForm = {
  email: "",
  password: "",
};

const initialEditAdminForm = {
  email: "",
  role: "admin",
  password: "",
};

const infoCards = [
  {
    title: "Admin access",
    description: "Secure sign-in for moderation, events, team, and placement updates.",
  },
  {
    title: "Super admin tools",
    description: "Create and manage other admins directly from the same console.",
  },
  {
    title: "Direct control",
    description: "Jump into the protected dashboard as soon as your session is active.",
  },
];

function StatusMessage({ tone = "neutral", children }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeMode();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    Boolean(localStorage.getItem("adminToken"))
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [adminPanelLoading, setAdminPanelLoading] = useState(isAdminLoggedIn);
  const [adminPanelError, setAdminPanelError] = useState("");
  const [adminListNotice, setAdminListNotice] = useState("");
  const [createAdminForm, setCreateAdminForm] = useState(initialCreateAdminForm);
  const [createAdminState, setCreateAdminState] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [editAdminId, setEditAdminId] = useState("");
  const [editAdminForm, setEditAdminForm] = useState(initialEditAdminForm);
  const [adminActionState, setAdminActionState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const loadAdminPanel = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setCurrentAdmin(null);
      setAdmins([]);
      setAdminPanelLoading(false);
      return;
    }

    setAdminPanelLoading(true);
    setAdminPanelError("");
    setAdminListNotice("");

    try {
      const meResponse = await api.get("/admin/me");
      setCurrentAdmin(meResponse.data);

      if (meResponse.data.role === "super_admin") {
        try {
          const adminsResponse = await api.get("/admin");
          setAdmins(adminsResponse.data);
        } catch (err) {
          if (err.response?.status === 404) {
            setAdmins([meResponse.data]);
            setAdminListNotice(
              "This deployed backend is missing the latest admin list route. You can still use the page, but the backend should be redeployed to unlock the full admin list."
            );
          } else {
            throw err;
          }
        }
      } else {
        setAdmins([]);
      }
    } catch (err) {
      setAdminPanelError(
        err.response?.data?.message || "Could not load admin session details."
      );
    } finally {
      setAdminPanelLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminPanel();
    }
  }, [isAdminLoggedIn]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", form);
      localStorage.setItem("adminToken", response.data.token);
      setIsAdminLoggedIn(true);
      setCurrentAdmin(response.data.admin || null);
      await loadAdminPanel();
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    setCurrentAdmin(null);
    setAdmins([]);
    setAdminPanelError("");
    setAdminListNotice("");
    setForm({
      email: "",
      password: "",
    });
    setCreateAdminForm(initialCreateAdminForm);
    setCreateAdminState({
      loading: false,
      error: "",
      success: "",
    });
    setEditAdminId("");
    setEditAdminForm(initialEditAdminForm);
    setAdminActionState({
      loading: false,
      error: "",
      success: "",
    });
    navigate("/admin", { replace: true });
  };

  const handleCreateAdminChange = (event) => {
    setCreateAdminForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    if (createAdminState.loading) return;

    setCreateAdminState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      try {
        await api.post("/admin/create-by-super-admin", createAdminForm);
      } catch (err) {
        if (err.response?.status === 404) {
          await api.post("/admin/create", createAdminForm);
          setAdminListNotice(
            "Admin was added using the older create route on the deployed backend. Redeploy the backend to restore the protected super-admin route."
          );
        } else {
          throw err;
        }
      }

      setCreateAdminForm(initialCreateAdminForm);
      setCreateAdminState({
        loading: false,
        error: "",
        success: "New admin added successfully.",
      });
      await loadAdminPanel();
    } catch (err) {
      setCreateAdminState({
        loading: false,
        success: "",
        error: err.response?.data?.message || "Could not add admin right now.",
      });
    }
  };

  const startEditAdmin = (admin) => {
    setEditAdminId(admin.id);
    setEditAdminForm({
      email: admin.email,
      role: admin.role,
      password: "",
    });
    setAdminActionState({
      loading: false,
      error: "",
      success: "",
    });
  };

  const cancelEditAdmin = () => {
    setEditAdminId("");
    setEditAdminForm(initialEditAdminForm);
    setAdminActionState({
      loading: false,
      error: "",
      success: "",
    });
  };

  const handleEditAdminChange = (event) => {
    setEditAdminForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdateAdmin = async (id) => {
    if (adminActionState.loading) return;

    setAdminActionState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const payload = {
        email: editAdminForm.email,
        role: editAdminForm.role,
      };

      if (editAdminForm.password.trim()) {
        payload.password = editAdminForm.password;
      }

      await api.patch(`/admin/${id}`, payload);
      setAdminActionState({
        loading: false,
        error: "",
        success: "Admin updated successfully.",
      });
      setEditAdminId("");
      setEditAdminForm(initialEditAdminForm);
      await loadAdminPanel();
    } catch (err) {
      setAdminActionState({
        loading: false,
        success: "",
        error:
          err.response?.status === 404
            ? "The deployed backend does not support admin editing yet. Redeploy the backend first."
            : err.response?.data?.message || "Could not update this admin.",
      });
    }
  };

  const handleDeleteAdmin = async (admin) => {
    const confirmed = window.confirm(
      `Remove ${admin.email} from admin access?`
    );
    if (!confirmed || adminActionState.loading) return;

    setAdminActionState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      await api.delete(`/admin/${admin.id}`);
      setAdminActionState({
        loading: false,
        error: "",
        success: "Admin removed successfully.",
      });
      await loadAdminPanel();
    } catch (err) {
      setAdminActionState({
        loading: false,
        success: "",
        error:
          err.response?.status === 404
            ? "The deployed backend does not support admin removal yet. Redeploy the backend first."
            : err.response?.data?.message || "Could not remove this admin.",
      });
    }
  };

  const isSuperAdmin = currentAdmin?.role === "super_admin";

  return (
    <section
      className={`relative min-h-screen overflow-hidden px-3 py-12 sm:px-6 sm:py-20 ${
        isDarkMode
          ? "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)]"
          : "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_34%),linear-gradient(180deg,#eef2ff_0%,#f8fafc_42%,#ffffff_100%)]"
      }`}
    >
      <div
        className={`absolute left-[-7rem] top-16 h-56 w-56 rounded-full blur-3xl ${
          isDarkMode ? "bg-indigo-500/15" : "bg-indigo-300/40"
        }`}
      />
      <div
        className={`absolute bottom-10 right-[-4rem] h-72 w-72 rounded-full blur-3xl ${
          isDarkMode ? "bg-cyan-400/10" : "bg-sky-200/45"
        }`}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-5 sm:gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section
            className={`rounded-[1.75rem] border p-5 sm:rounded-[2.25rem] sm:p-10 ${
              isDarkMode
                ? "border-slate-800/80 bg-slate-950/70 text-slate-100 shadow-[0_30px_100px_rgba(2,6,23,0.5)] backdrop-blur"
                : "border-white/80 bg-white/85 text-slate-900 shadow-[0_30px_100px_rgba(99,102,241,0.12)] backdrop-blur"
            }`}
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.28em] ${
                isDarkMode
                  ? "border-slate-700 bg-slate-900 text-indigo-300"
                  : "border-indigo-100 bg-indigo-50 text-indigo-700"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Console
            </div>

            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:mt-6 sm:text-5xl">
              Secure control panel for the IIITians Network team.
            </h1>

            <p
              className={`mt-4 max-w-2xl text-sm leading-7 sm:mt-5 sm:text-lg sm:leading-8 ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Sign in to access protected admin routes. If your account is a
              super admin, you can also create and monitor other admin accounts
              from the same page.
            </p>

            <div className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
              {infoCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-2xl border p-4 sm:rounded-3xl sm:p-5 ${
                    isDarkMode
                      ? "border-slate-800 bg-slate-900/80"
                      : "border-indigo-100 bg-white"
                  }`}
                >
                  <div className="text-sm font-semibold text-indigo-600">
                    {card.title}
                  </div>
                  <div
                    className={`mt-2 text-sm leading-6 sm:mt-3 sm:leading-7 ${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {card.description}
                  </div>
                </div>
              ))}
            </div>

            {isAdminLoggedIn && (
              <div
                className={`mt-7 rounded-[1.5rem] border p-4 sm:mt-10 sm:rounded-[2rem] sm:p-6 ${
                  isDarkMode
                    ? "border-emerald-900/60 bg-emerald-950/30"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-emerald-600">
                      Active session
                    </div>
                    <div
                      className={`mt-1 break-all text-base font-semibold sm:text-lg ${
                        isDarkMode ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      {adminPanelLoading
                        ? "Checking your admin session..."
                        : currentAdmin?.email || "Admin"}
                    </div>
                    {!adminPanelLoading && currentAdmin?.role && (
                      <div
                        className={`mt-1 text-sm ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        Role: {currentAdmin.role.replace("_", " ")}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/alumni/admin")}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:px-5 sm:py-3"
                    >
                      Open dashboard
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-5 sm:py-3 ${
                        isDarkMode
                          ? "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div
              className={`rounded-[1.75rem] border p-5 sm:rounded-[2.25rem] sm:p-8 ${
                isDarkMode
                  ? "border-slate-800/80 bg-slate-950/75 shadow-[0_30px_100px_rgba(2,6,23,0.5)] backdrop-blur"
                  : "border-white/80 bg-white/90 shadow-[0_30px_100px_rgba(99,102,241,0.12)] backdrop-blur"
              }`}
            >
                <div className="mb-5 flex items-center gap-3 sm:mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                    <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                    Access
                  </div>
                  <h2
                    className={`text-xl font-semibold sm:text-2xl ${
                      isDarkMode ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    Sign in to continue
                  </h2>
                </div>
              </div>

              {adminPanelError && <StatusMessage tone="error">{adminPanelError}</StatusMessage>}
              {adminListNotice && <StatusMessage>{adminListNotice}</StatusMessage>}
              {error && <StatusMessage tone="error">{error}</StatusMessage>}

              <form onSubmit={submit} className="mt-5 space-y-4 sm:space-y-5">
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@iiitians.in"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition disabled:opacity-70 sm:text-base ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition disabled:opacity-70 sm:text-base ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                >
                  {loading ? "Signing in..." : "Continue to admin"}
                </button>
              </form>

              <div
                className={`mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <button
                  type="button"
                  onClick={() => navigate("/alumni/admin")}
                  className={`rounded-2xl border px-4 py-3.5 text-left transition sm:py-4 ${
                    isDarkMode
                      ? "border-slate-800 bg-slate-900/80 hover:border-indigo-500/60"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white"
                  }`}
                >
                  <div className="text-sm font-semibold text-indigo-600">
                    Network Legacy
                  </div>
                  <div className="mt-1 text-sm">
                    Review pending, approved, and rejected legacy profiles.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/placement/admin")}
                  className={`rounded-2xl border px-4 py-3.5 text-left transition sm:py-4 ${
                    isDarkMode
                      ? "border-slate-800 bg-slate-900/80 hover:border-indigo-500/60"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white"
                  }`}
                >
                  <div className="text-sm font-semibold text-indigo-600">
                    Placement data
                  </div>
                  <div className="mt-1 text-sm">
                    Jump into placement updates after choosing a college.
                  </div>
                </button>
              </div>
            </div>

            {isAdminLoggedIn && isSuperAdmin && (
              <div className="grid gap-5 sm:gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div
                  className={`rounded-[1.75rem] border p-5 sm:rounded-[2.25rem] sm:p-8 ${
                    isDarkMode
                      ? "border-slate-800/80 bg-slate-950/75 shadow-[0_30px_100px_rgba(2,6,23,0.5)] backdrop-blur"
                      : "border-white/80 bg-white/90 shadow-[0_30px_100px_rgba(99,102,241,0.12)] backdrop-blur"
                  }`}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                        Super Admin
                      </div>
                      <h2
                        className={`text-xl font-semibold sm:text-2xl ${
                          isDarkMode ? "text-slate-100" : "text-slate-900"
                        }`}
                      >
                        Add admin
                      </h2>
                    </div>
                  </div>

                  {createAdminState.error && (
                    <StatusMessage tone="error">
                      {createAdminState.error}
                    </StatusMessage>
                  )}
                  {createAdminState.success && (
                    <StatusMessage tone="success">
                      {createAdminState.success}
                    </StatusMessage>
                  )}

                  <form onSubmit={handleCreateAdmin} className="mt-5 space-y-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="newadmin@iiitians.in"
                      value={createAdminForm.email}
                      onChange={handleCreateAdminChange}
                      required
                      className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                        isDarkMode
                          ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      }`}
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Set a password"
                      value={createAdminForm.password}
                      onChange={handleCreateAdminChange}
                      required
                      className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                        isDarkMode
                          ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      }`}
                    />

                    <button
                      type="submit"
                      disabled={createAdminState.loading}
                      className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    >
                      {createAdminState.loading ? "Adding admin..." : "Add admin"}
                    </button>
                  </form>
                </div>

                <div
                  className={`rounded-[1.75rem] border p-5 sm:rounded-[2.25rem] sm:p-8 ${
                    isDarkMode
                      ? "border-slate-800/80 bg-slate-950/75 shadow-[0_30px_100px_rgba(2,6,23,0.5)] backdrop-blur"
                      : "border-white/80 bg-white/90 shadow-[0_30px_100px_rgba(99,102,241,0.12)] backdrop-blur"
                  }`}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                        Admin Control
                      </div>
                      <h2
                        className={`text-xl font-semibold sm:text-2xl ${
                          isDarkMode ? "text-slate-100" : "text-slate-900"
                        }`}
                      >
                        Edit or remove admins
                      </h2>
                    </div>
                  </div>

                  {adminActionState.error && (
                    <StatusMessage tone="error">
                      {adminActionState.error}
                    </StatusMessage>
                  )}
                  {adminActionState.success && (
                    <StatusMessage tone="success">
                      {adminActionState.success}
                    </StatusMessage>
                  )}

                  <div className="mt-5 space-y-3">
                    {admins.map((admin) => {
                      const isEditing = editAdminId === admin.id;
                      const isSelf = currentAdmin?.id === admin.id;

                      return (
                        <div
                          key={admin.id}
                          className={`rounded-2xl border px-4 py-3.5 sm:py-4 ${
                            isDarkMode
                              ? "border-slate-800 bg-slate-950 text-slate-200"
                              : "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                        >
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                type="email"
                                name="email"
                                value={editAdminForm.email}
                                onChange={handleEditAdminChange}
                                placeholder="Admin email"
                                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                                  isDarkMode
                                    ? "border-slate-700 bg-slate-900 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                                    : "border-slate-200 bg-white text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                                }`}
                              />

                              <select
                                name="role"
                                value={editAdminForm.role}
                                onChange={handleEditAdminChange}
                                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                                  isDarkMode
                                    ? "border-slate-700 bg-slate-900 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                                    : "border-slate-200 bg-white text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                                }`}
                              >
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super admin</option>
                              </select>

                              <input
                                type="password"
                                name="password"
                                value={editAdminForm.password}
                                onChange={handleEditAdminChange}
                                placeholder="New password (optional)"
                                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${
                                  isDarkMode
                                    ? "border-slate-700 bg-slate-900 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                                    : "border-slate-200 bg-white text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                                }`}
                              />

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateAdmin(admin.id)}
                                  disabled={adminActionState.loading}
                                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <UserCog className="h-4 w-4" />
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditAdmin}
                                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    isDarkMode
                                      ? "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="break-all font-semibold">{admin.email}</div>
                                  <div className="mt-1 text-sm capitalize text-indigo-600">
                                    {admin.role.replace("_", " ")}
                                    {isSelf ? " · You" : ""}
                                  </div>
                                </div>
                                <div
                                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                                    admin.role === "super_admin"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {admin.role === "super_admin" ? "Owner" : "Admin"}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditAdmin(admin)}
                                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                >
                                  <UserCog className="h-4 w-4" />
                                  Edit
                                </button>

                                {!isSelf && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAdmin(admin)}
                                    disabled={adminActionState.loading}
                                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
