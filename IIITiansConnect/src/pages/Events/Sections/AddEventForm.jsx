import { useState, useEffect } from "react";
import api from "../../../api/axios";

const AddEventForm = ({ onSuccess, editingEvent, onCancel, onDelete }) => {
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    collegeName: "",
    clubName: "",
    link: "", // ✅ FIXED
  });

  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        date: editingEvent.date?.slice(0, 10) || "",
        collegeName: editingEvent.collegeName || "",
        clubName: editingEvent.clubName || "",
        link: editingEvent.link || "", // ✅ FIXED
      });

      setPreview(editingEvent.banner?.url || "");
    }
  }, [editingEvent]);

  useEffect(() => {
    const loadColleges = async () => {
      try {
        const response = await api.get("/colleges");
        setCollegeOptions(
          (response.data || []).map((college) => college?.name).filter(Boolean)
        );
      } catch {
        setCollegeOptions([]);
      }
    };

    loadColleges();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, value)
    );
    if (banner) data.append("banner", banner);

    try {
      setLoading(true);

      const res = editingEvent
        ? await api.patch(`/events/${editingEvent._id}`, data)
        : await api.post("/events", data);

      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Delete this event permanently? This action cannot be undone."
      )
    )
      return;

    try {
      await api.delete(`/events/${editingEvent._id}`);
      onDelete?.(editingEvent._id);
      onCancel();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border rounded-2xl p-6 mb-16 space-y-6"
    >
      <h3 className="text-xl font-semibold">
        {editingEvent ? "Edit Event" : "Create Event"}
      </h3>

      {/* BASIC INFO */}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Event title
          </span>
          <input
            name="title"
            placeholder="e.g. E-Summit 2026"
            value={form.title}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Event date
          </span>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Short description
        </span>
        <textarea
          name="description"
          placeholder="e.g. Flagship entrepreneurship event with speaker sessions, startup showcase, and competitions."
          value={form.description}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          rows={3}
        />
      </label>

      {/* META INFO */}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            College / institute
          </span>
          <input
            name="collegeName"
            list="event-college-options"
            placeholder="Choose or type an IIIT, e.g. IIIT Kota"
            value={form.collegeName}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        </label>
        <datalist id="event-college-options">
          {collegeOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>

        <label className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Club / society
          </span>
          <input
            name="clubName"
            placeholder="e.g. E-Cell IIIT Nagpur"
            value={form.clubName}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        </label>
      </div>

      {/* LINK */}
      <div>
        <input
          name="link"
          placeholder="e.g. https://forms.gle/esummit-registration"
          value={form.link}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional – Google Form, website, or registration link
        </p>
      </div>

      {/* IMAGE */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Banner
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-36 w-full object-cover rounded mb-3"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Event"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="border px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>

        {editingEvent && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 font-medium hover:underline"
          >
            Delete Event
          </button>
        )}
      </div>
    </form>
  );
};

export default AddEventForm;
