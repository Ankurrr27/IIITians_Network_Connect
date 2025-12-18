import { useState } from "react";
import api from "../../../api/axios";

export default function TeamMemberForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    roleType: "", // 🔥 REQUIRED
    iiit: "",
    team: "Tech",
    year: "2025-26",
    email: "",
    linkedin: "",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (photo) {
      formData.append("photo", photo); // must match multer field
    }

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
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white border rounded-xl px-6 pb-6 pt-3 space-y-3"
    >
      <h2 className="text-lg font-semibold">Add Team Member</h2>

      {/* 🔥 ROLE CATEGORY (IMPORTANT) */}
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

      {/* BASIC FIELDS */}
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

      {/* PHOTO UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        className="w-full"
        required
      />

      {/* TEAM + YEAR */}
      <div className="flex gap-4">
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
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Add Member"}
      </button>
    </form>
  );
}
