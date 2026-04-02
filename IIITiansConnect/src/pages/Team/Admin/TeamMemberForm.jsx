import { useState } from "react";
import api from "../../../api/axios";
import ImageCropModal from "../../../components/ImageCropModal";

export default function TeamMemberForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    roleType: "",
    iiit: "",
    team: "Tech",
    year: "2025-26",
    email: "",
    linkedin: "",
  });

  const [photo, setPhoto] = useState(null);
  const [rawPhoto, setRawPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (photo) formData.append("photo", photo);

    try {
      await api.post("/team", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({
        name: "",
        role: "",
        roleType: "",
        iiit: "",
        team: "Tech",
        year: "2025-26",
        email: "",
        linkedin: "",
      });
      setPhoto(null);
      setRawPhoto(null);
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="
        bg-white border rounded-xl
        p-4 sm:p-6
        max-w-3xl mx-auto
        space-y-4
      "
    >
      <h2 className="text-lg font-semibold">Add Team Member</h2>

      {/* ROLE TYPE */}
      <select
        name="roleType"
        value={form.roleType}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="">Select Role Category</option>
        <option value="EXEC">President / Vice President</option>
        <option value="LEAD">Lead</option>
        <option value="MEMBER">Team Member</option>
      </select>

      {/* MAIN FIELDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["name", "role", "iiit", "email", "linkedin"].map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key.toUpperCase()}
            className="w-full border px-3 py-2 rounded"
            required={key !== "linkedin"}
          />
        ))}
      </div>

      {/* PHOTO */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="team-photo-upload"
            className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200"
          >
            {photo ? "Replace photo" : "Upload photo"}
          </label>

          <input
            id="team-photo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setRawPhoto(file);
              }
              e.target.value = "";
            }}
            className="hidden"
            required={!photo}
          />

          {photo && (
            <>
              <button
                type="button"
                onClick={() => setRawPhoto(photo)}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                Edit photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setRawPhoto(null);
                }}
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
              >
                Remove photo
              </button>
            </>
          )}
        </div>

        {photo && (
          <p className="text-sm text-slate-500">
            Selected photo: <span className="font-medium">{photo.name}</span>
          </p>
        )}
      </div>

      {/* TEAM + YEAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          name="team"
          value={form.team}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option>Core</option>
          <option>Tech</option>
          <option>Design</option>
          <option>Content</option>
          <option>Social Media</option>
        </select>

        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <button
        disabled={loading}
        className="
          bg-indigo-600 text-white
          px-4 py-2 rounded
          w-full sm:w-fit
        "
      >
        {loading ? "Uploading..." : "Add Member"}
      </button>

      {rawPhoto && (
        <ImageCropModal
          file={rawPhoto}
          onClose={() => setRawPhoto(null)}
          onCrop={(croppedFile) => {
            setPhoto(croppedFile);
            setRawPhoto(null);
          }}
        />
      )}
    </form>
  );
}
