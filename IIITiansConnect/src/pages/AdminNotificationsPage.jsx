import { useEffect, useState } from "react";
import api from "../api/axios";

const initialForm = {
  title: "",
  message: "",
  type: "milestone",
  isActive: false,
  showOnEntry: true,
};

export default function AdminNotificationsPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadNotification = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/app-notifications/admin/current");
        setForm({
          title: response.data?.title || "",
          message: response.data?.message || "",
          type: response.data?.type || "milestone",
          isActive: Boolean(response.data?.isActive),
          showOnEntry:
            response.data?.showOnEntry === undefined
              ? true
              : Boolean(response.data.showOnEntry),
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load the custom app notification."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/app-notifications/admin/current", form);
      setSuccess("Custom app notification updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save the custom app notification."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
        Loading notification workspace...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
          In-app notification
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Custom Entry Notification
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Publish a custom top-right notification that users will see when they
          enter the app.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Welcome back, new updates are live"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="e.g. Congratulations, registrations are now open for our next campus event."
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Theme</span>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="milestone">Milestone</option>
              <option value="event">Event</option>
              <option value="team">Team</option>
              <option value="legacy">Legacy</option>
              <option value="post">Discuss</option>
              <option value="club">College / Club</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Notification is active
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="showOnEntry"
              checked={form.showOnEntry}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Show when user enters the app
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save notification"}
        </button>
      </form>
    </div>
  );
}
