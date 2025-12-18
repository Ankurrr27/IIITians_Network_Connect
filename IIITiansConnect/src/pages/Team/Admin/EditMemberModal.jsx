import { useState } from "react";
import api from "../../../api/axios";
import { X } from "lucide-react";

export default function EditMemberModal({ member, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: member.name || "",
    role: member.role || "",
    roleType: member.roleType || "MEMBER",
    iiit: member.iiit || "",
    email: member.email || "",
    team: member.team || "Core",
    year: member.year || "",
    linkedin: member.linkedin || "",
    instagram: member.instagram || "",
    twitter: member.twitter || "",
    order: member.order ?? 0,
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append("photo", photo);

      const res = await api.put(`/team/${member._id}`, fd);

      onUpdated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Team Member
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY + FOOTER (INSIDE FORM) */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* BASIC INFO */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="input"
              required
            />
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Role (President, Tech Lead)"
              className="input"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <select
              name="roleType"
              value={form.roleType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="EXEC">EXEC</option>
              <option value="LEAD">LEAD</option>
              <option value="MEMBER">MEMBER</option>
            </select>

            <input
              name="iiit"
              value={form.iiit}
              onChange={handleChange}
              placeholder="IIIT (e.g. IIIT Kota)"
              className="input"
              required
            />
          </div>

          {/* CONTACT */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Official Email"
            className="input"
            required
          />

          {/* META */}
          <div className="grid sm:grid-cols-3 gap-4">
            <select
              name="team"
              value={form.team}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="Core">Core</option>
              <option value="Tech">Tech</option>
              <option value="Design">Design</option>
              <option value="Content">Content</option>
              <option value="Social Media">Social Media</option>
            </select>

            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year (2025-26)"
              className="input"
              required
            />

            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              placeholder="Order"
              className="input"
            />
          </div>

          {/* SOCIALS */}
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              className="input"
            />
            <input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
              className="input"
            />
            <input
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              placeholder="Twitter URL"
              className="input"
            />
          </div>

          {/* PHOTO */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="text-sm text-gray-700
                       file:mr-4 file:py-2 file:px-3
                       file:rounded-lg file:border
                       file:border-gray-300
                       file:bg-gray-100 file:text-gray-800
                       hover:file:bg-gray-200"
          />

          {/* SUBMIT */}
          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-lg py-2
                         hover:bg-indigo-700 transition"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
