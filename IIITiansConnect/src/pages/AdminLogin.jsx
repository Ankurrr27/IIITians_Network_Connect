import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Trash2, UserCog, UserPlus, Users } from "lucide-react";
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

function StatusMessage({ tone = "neutral", children }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    neutral: "border-stone-200 bg-stone-50 text-stone-700",
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
            ? "Backend does not support admin editing yet."
            : err.response?.data?.message || "Could not update this admin.",
      });
    }
  };

  const handleDeleteAdmin = async (admin) => {
    const confirmed = window.confirm(`Remove ${admin.email} from admin access?`);
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
            ? "Backend does not support admin removal yet."
            : err.response?.data?.message || "Could not remove this admin.",
      });
    }
  };

  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const shellClass = isDarkMode
    ? "border-slate-800/80 bg-slate-950/75 text-slate-100 shadow-[0_30px_100px_rgba(2,6,23,0.5)]"
    : "border-[#eadfce] bg-[#fffdf8] text-slate-900 shadow-[0_24px_80px_rgba(120,113,108,0.10)]";

  const inputClass = isDarkMode
    ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
    : "border-stone-200 bg-[#fffaf2] text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <section
      className={`min-h-screen px-3 py-12 sm:px-6 sm:py-20 ${
        isDarkMode
          ? "bg-[linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)]"
          : "bg-[linear-gradient(180deg,#f8f2e8_0%,#fbf7f0_46%,#fffdf8_100%)]"
      }`}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className={`rounded-[1.8rem] border p-5 sm:p-7 ${shellClass}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700">
            <LockKeyhole className="h-4 w-4" />
            Admin
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            IIITians Network Admin
          </h1>
          <p className={`mt-3 text-sm leading-7 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            Simple access for admin operations.
          </p>

          {isAdminLoggedIn && (
            <div className="mt-5 flex flex-col gap-3 rounded-[1.4rem] border border-emerald-200 bg-emerald-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-emerald-700">
                  {adminPanelLoading ? "Checking session..." : currentAdmin?.email || "Admin"}
                </div>
                {!adminPanelLoading && currentAdmin?.role && (
                  <div className="mt-1 text-sm text-emerald-800/80">
                    {currentAdmin.role.replace("_", " ")}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/legacy/admin")}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`rounded-[1.8rem] border p-5 sm:p-7 ${shellClass}`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Sign in</h2>
          </div>

          {adminPanelError && <StatusMessage tone="error">{adminPanelError}</StatusMessage>}
          {adminListNotice && <StatusMessage>{adminListNotice}</StatusMessage>}
          {error && <StatusMessage tone="error">{error}</StatusMessage>}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="admin@iiitians.in"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${inputClass}`}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${inputClass}`}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>
        </div>

        {isAdminLoggedIn && isSuperAdmin && (
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div className={`rounded-[1.8rem] border p-5 sm:p-7 ${shellClass}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <UserPlus className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Add admin</h2>
              </div>

              {createAdminState.error && (
                <StatusMessage tone="error">{createAdminState.error}</StatusMessage>
              )}
              {createAdminState.success && (
                <StatusMessage tone="success">{createAdminState.success}</StatusMessage>
              )}

              <form onSubmit={handleCreateAdmin} className="mt-5 space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="newadmin@iiitians.in"
                  value={createAdminForm.email}
                  onChange={handleCreateAdminChange}
                  required
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${inputClass}`}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={createAdminForm.password}
                  onChange={handleCreateAdminChange}
                  required
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${inputClass}`}
                />

                <button
                  type="submit"
                  disabled={createAdminState.loading}
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                >
                  {createAdminState.loading ? "Adding..." : "Add admin"}
                </button>
              </form>
            </div>

            <div className={`rounded-[1.8rem] border p-5 sm:p-7 ${shellClass}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Admins</h2>
              </div>

              {adminActionState.error && (
                <StatusMessage tone="error">{adminActionState.error}</StatusMessage>
              )}
              {adminActionState.success && (
                <StatusMessage tone="success">{adminActionState.success}</StatusMessage>
              )}

              <div className="mt-5 space-y-3">
                {admins.map((admin) => {
                  const isEditing = editAdminId === admin.id;
                  const isSelf = currentAdmin?.id === admin.id;

                  return (
                    <div
                      key={admin.id}
                      className={`rounded-2xl border px-4 py-4 ${
                        isDarkMode
                          ? "border-slate-800 bg-slate-950 text-slate-200"
                          : "border-stone-200 bg-[#fffaf2] text-stone-700"
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
                            className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${inputClass}`}
                          />

                          <select
                            name="role"
                            value={editAdminForm.role}
                            onChange={handleEditAdminChange}
                            className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${inputClass}`}
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
                            className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition sm:text-base ${inputClass}`}
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
                              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
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
                                {isSelf ? " - You" : ""}
                              </div>
                            </div>
                            <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
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
      </div>
    </section>
  );
}
