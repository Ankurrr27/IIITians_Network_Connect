import { useState } from "react";
import api from "../../../api/axios";
import { Camera, Mail, PencilLine, ShieldCheck, X } from "lucide-react";
import ImageCropModal from "../../../components/ImageCropModal";

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
    aboutText: member.aboutText || "",
    messageText: member.messageText || "",
    order: member.order ?? 0,
    isActive: member.isActive === false ? "false" : "true",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawPhoto, setRawPhoto] = useState(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-indigo-50 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                <PencilLine size={14} />
                Edit Team Member
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                {member.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Update public team details, handles, leadership copy, and visibility.
              </p>
            </div>
          
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900"
          >
            <X size={18} />
          </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto px-6 py-5"
        >
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
              <div className="overflow-hidden rounded-[1.3rem] bg-white ring-1 ring-slate-200">
                <img
                  src={photo ? URL.createObjectURL(photo) : member.photo?.url}
                  alt={member.name}
                  className="aspect-[4/4.4] w-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                  <Camera size={16} />
                  {photo ? "Replace photo" : "Upload new photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setRawPhoto(e.target.files?.[0] || null)}
                  />
                </label>

                {photo && (
                  <button
                    type="button"
                    onClick={() => setRawPhoto(photo)}
                    className="w-full rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Re-edit uploaded photo
                  </button>
                )}
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Current status
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-indigo-600" />
                    {member.roleType} - {member.team}
                  </div>
                  <div>{member.role}</div>
                  <div>{member.year}</div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={15} />
                    {member.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Basic details
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Official Email"
                    className="input sm:col-span-2"
                    required
                  />
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Team placement
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <select
                    name="team"
                    value={form.team}
                    onChange={handleChange}
                    className="input"
                    required
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

                  <select
                    name="isActive"
                    value={form.isActive}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Social handles
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
              </section>

              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Leadership spotlight copy
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <textarea
                    name="aboutText"
                    value={form.aboutText}
                    onChange={handleChange}
                    placeholder="Leadership about text"
                    className="input min-h-[140px]"
                  />
                  <textarea
                    name="messageText"
                    value={form.messageText}
                    onChange={handleChange}
                    placeholder="Leadership message text"
                    className="input min-h-[140px]"
                  />
                </div>
              </section>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
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
      </div>
    </div>
  );
}
