import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpenText,
  Building2,
  LockKeyhole,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import api from "../api/axios";

const initialCreateAdminForm = {
  email: "",
  role: "admin",
  password: "",
};

const initialEditAdminForm = {
  email: "",
  role: "admin",
  password: "",
};

function StatusMessage({ tone = "neutral", children }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className={`rounded-[1.1rem] border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  );
}

function LightInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base"
    />
  );
}

function LightSelect(props) {
  return (
    <select
      {...props}
      className="w-full rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base"
    />
  );
}

function Surface({ children, className = "" }) {
  return (
    <div
      className={`rounded-[1.9rem] border border-[#dde5f6] bg-white/95 p-5 shadow-[0_26px_70px_-46px_rgba(79,70,229,0.25)] sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    Boolean(localStorage.getItem("adminToken"))
  );

  const [form, setForm] = useState({ email: "", password: "" });
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
              "Backend needs redeploy for full admin list support."
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
    if (isAdminLoggedIn) loadAdminPanel();
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
    setForm({ email: "", password: "" });
    setCreateAdminForm(initialCreateAdminForm);
    setCreateAdminState({ loading: false, error: "", success: "" });
    setEditAdminId("");
    setEditAdminForm(initialEditAdminForm);
    setAdminActionState({ loading: false, error: "", success: "" });
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

    setCreateAdminState({ loading: true, error: "", success: "" });

    try {
      try {
        await api.post("/admin/create-by-super-admin", createAdminForm);
      } catch (err) {
        if (err.response?.status === 404) {
          await api.post("/admin/create", createAdminForm);
          setAdminListNotice("Backend needs redeploy for protected admin create.");
        } else {
          throw err;
        }
      }

      setCreateAdminForm(initialCreateAdminForm);
      setCreateAdminState({
        loading: false,
        error: "",
        success: "Admin added successfully.",
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
    setAdminActionState({ loading: false, error: "", success: "" });
  };

  const cancelEditAdmin = () => {
    setEditAdminId("");
    setEditAdminForm(initialEditAdminForm);
    setAdminActionState({ loading: false, error: "", success: "" });
  };

  const handleEditAdminChange = (event) => {
    setEditAdminForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdateAdmin = async (id) => {
    if (adminActionState.loading) return;

    setAdminActionState({ loading: true, error: "", success: "" });

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
            ? "Backend does not support admin editing yet."
            : err.response?.data?.message || "Could not update this admin.",
      });
    }
  };

  const handleDeleteAdmin = async (admin) => {
    const confirmed = window.confirm(`Remove ${admin.email} from admin access?`);
    if (!confirmed || adminActionState.loading) return;

    setAdminActionState({ loading: true, error: "", success: "" });

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
            ? "Backend does not support admin removal yet."
            : err.response?.data?.message || "Could not remove this admin.",
      });
    }
  };

  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const quickPanels = useMemo(
    () => [
      {
        title: "Network Legacy",
        text: "Review pending legacy requests and move approved profiles live.",
        to: "/legacy/admin",
        icon: Users,
        accent: "from-[#dbeafe] to-[#eef2ff]",
      },
      {
        title: "Discuss & Events",
        text: "Moderate club accounts, announcements, and pushed events.",
        to: "/discuss/admin",
        icon: BadgeCheck,
        accent: "from-[#dcfce7] to-[#ecfeff]",
      },
      {
        title: "Colleges & Placements",
        text: "Keep college assets, links, and placement records updated.",
        to: "/colleges/admin",
        icon: Building2,
        accent: "from-[#fef3c7] to-[#fff7ed]",
      },
    ],
    []
  );

  return (
    <section className="relative min-h-screen bg-[linear-gradient(180deg,_#eef7ff_0%,_#f7fbff_36%,_#f9fcff_100%)] px-3 py-12 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <Surface className="overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative">
              <div className="absolute right-0 top-0 hidden h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(129,140,248,0.24),_transparent_68%)] lg:block" />
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
                <ShieldCheck className="h-4 w-4" />
                Admin Workspace
              </div>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Run the network from one calm control desk.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
                Manage approvals, club activity, legacy, teams, colleges, and placements
                with a cleaner admin workspace designed around the real site flow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/guide?flow=admin"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Open admin guide
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                {isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={() => navigate("/legacy/admin")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Go to dashboard
                  </button>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MetricCard
                  label="Admins visible"
                  value={isSuperAdmin ? String(admins.length || 1) : currentAdmin ? "1" : "--"}
                />
                <MetricCard
                  label="Your role"
                  value={
                    currentAdmin?.role
                      ? currentAdmin.role.replace("_", " ")
                      : "Not signed in"
                  }
                />
                <MetricCard
                  label="Guide status"
                  value="Ready"
                />
              </div>
            </div>

            <div className="grid gap-3">
              {quickPanels.map((panel) => {
                const Icon = panel.icon;
                return (
                  <Link
                    key={panel.title}
                    to={panel.to}
                    className={`group rounded-[1.6rem] bg-gradient-to-br ${panel.accent} p-4 transition hover:translate-y-[-2px]`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-white text-slate-900 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-500 transition group-hover:text-slate-900" />
                    </div>
                    <div className="mt-4 text-lg font-semibold text-slate-900">
                      {panel.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{panel.text}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </Surface>

        {adminPanelError && <StatusMessage tone="error">{adminPanelError}</StatusMessage>}
        {adminListNotice && <StatusMessage>{adminListNotice}</StatusMessage>}

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Surface>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  <LockKeyhole className="h-4 w-4" />
                  Admin Access
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">Sign in</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Use your admin credentials to enter the workspace and manage live content.
                </p>
              </div>
              <div className="hidden h-20 w-20 rounded-[1.4rem] bg-[linear-gradient(135deg,_#e0e7ff,_#dbeafe)] sm:block" />
            </div>

            {error && <div className="mt-5"><StatusMessage tone="error">{error}</StatusMessage></div>}

            {isAdminLoggedIn ? (
               <div className="mt-8 rounded-[1.2rem] bg-indigo-50/50 p-6 text-center border border-indigo-100">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100/50 text-indigo-600 mb-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">You are securely signed in</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Use the quick jump panels on the left or the top navigation 
                    to manage the network.
                  </p>
               </div>
            ) : (
            <>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <LightInput
                type="email"
                name="email"
                placeholder="e.g. admin@iiitians.in"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <LightInput
                type="password"
                name="password"
                placeholder="Enter your admin password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[1.2rem] bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {loading ? "Signing in..." : "Continue to admin"}
              </button>
            </form>
            </>
            )}
          </Surface>

          <Surface>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <BadgeCheck className="h-4 w-4" />
                  Session
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                  Current workspace state
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  See who is signed in and jump into the routes you need most.
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#c7d2fe,_#bfdbfe)] text-lg font-semibold text-indigo-900">
                {(currentAdmin?.email || "AD").slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="text-sm font-semibold text-emerald-800">
                {adminPanelLoading
                  ? "Checking session..."
                  : currentAdmin?.email || "No active admin session"}
              </div>
              <div className="mt-1 text-sm text-emerald-700/90">
                {currentAdmin?.role
                  ? currentAdmin.role.replace("_", " ")
                  : "Sign in to unlock admin routes"}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniJump title="Legacy admin" to="/legacy/admin" />
              <MiniJump title="Discuss admin" to="/discuss/admin" />
              <MiniJump title="Team admin" to="/team/admin" />
              <MiniJump title="Placements" to="/placement/admin" />
            </div>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 w-full rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            )}
          </Surface>
        </div>

        {isAdminLoggedIn && isSuperAdmin && (
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Surface>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                    <UserPlus className="h-4 w-4" />
                    Super Admin
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                    Add a new admin
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Create access for a new admin account directly from here.
                  </p>
                </div>
                <div className="hidden h-20 w-20 rounded-[1.4rem] bg-[linear-gradient(135deg,_#ede9fe,_#dbeafe)] sm:block" />
              </div>

              {createAdminState.error && (
                <div className="mt-5">
                  <StatusMessage tone="error">{createAdminState.error}</StatusMessage>
                </div>
              )}
              {createAdminState.success && (
                <div className="mt-5">
                  <StatusMessage tone="success">{createAdminState.success}</StatusMessage>
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="mt-6 space-y-4">
                <LightInput
                  type="email"
                  name="email"
                  placeholder="e.g. newadmin@iiitians.in"
                  value={createAdminForm.email}
                  onChange={handleCreateAdminChange}
                  required
                />

                <LightSelect
                  name="role"
                  value={createAdminForm.role}
                  onChange={handleCreateAdminChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super admin</option>
                </LightSelect>

                <LightInput
                  type="password"
                  name="password"
                  placeholder="Create a password for the new admin"
                  value={createAdminForm.password}
                  onChange={handleCreateAdminChange}
                  required
                />

                <button
                  type="submit"
                  disabled={createAdminState.loading}
                  className="w-full rounded-[1.2rem] bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                >
                  {createAdminState.loading ? "Adding..." : "Add admin"}
                </button>
              </form>
            </Surface>

            <Surface>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                    <Users className="h-4 w-4" />
                    Access list
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                    Admin accounts
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Review all active admins, adjust roles, or remove access.
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {admins.length || 1} total
                </div>
              </div>

              {adminActionState.error && (
                <div className="mt-5">
                  <StatusMessage tone="error">{adminActionState.error}</StatusMessage>
                </div>
              )}
              {adminActionState.success && (
                <div className="mt-5">
                  <StatusMessage tone="success">{adminActionState.success}</StatusMessage>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {admins.map((admin, index) => {
                  const isEditing = editAdminId === admin.id;
                  const isSelf = currentAdmin?.id === admin.id;
                  const initials = (admin.email || "AD")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={admin.id}
                      className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <LightInput
                            type="email"
                            name="email"
                            value={editAdminForm.email}
                            onChange={handleEditAdminChange}
                            placeholder="e.g. admin@iiitians.in"
                          />

                          <LightSelect
                            name="role"
                            value={editAdminForm.role}
                            onChange={handleEditAdminChange}
                          >
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super admin</option>
                          </LightSelect>

                          <LightInput
                            type="password"
                            name="password"
                            value={editAdminForm.password}
                            onChange={handleEditAdminChange}
                            placeholder="Set a new password if needed"
                          />

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateAdmin(admin.id)}
                              disabled={adminActionState.loading}
                              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <UserCog className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditAdmin}
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,_#dbeafe,_#e0e7ff)] text-sm font-semibold text-indigo-900">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {admin.email}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm">
                                  {admin.role.replace("_", " ")}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-500 shadow-sm">
                                  Slot {index + 1}
                                </span>
                                {isSelf && (
                                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEditAdmin(admin)}
                              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
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
            </Surface>
          </div>
        )}
      </div>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold capitalize text-slate-900">
        {value}
      </div>
    </div>
  );
}

function MiniJump({ title, to }) {
  return (
    <Link
      to={to}
      className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-white hover:text-indigo-700"
    >
      {title}
    </Link>
  );
}
