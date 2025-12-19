import { ExternalLink, Pencil, Save, X, Upload } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";

const CollegeCard = ({ college, onUpdated }) => {
  const { _id, name, logo, description, website } = college;

  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);

  const [form, setForm] = useState({
    description: description || "",
    website: website || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     UPLOAD LOGO
  ========================= */
  const handleLogoUpload = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      setLoadingLogo(true);
      const res = await api.patch(
        `/colleges/${_id}/logo`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onUpdated(res.data);
      setLogoFile(null);
    } catch (err) {
      console.error(err);
      alert("Logo upload failed");
    } finally {
      setLoadingLogo(false);
    }
  };

  /* =========================
     SAVE TEXT
  ========================= */
  const handleSave = async () => {
    try {
      const res = await api.patch(`/colleges/${_id}`, form);
      onUpdated(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div
      className="
        bg-white border rounded-lg sm:rounded-2xl p-2 sm:p-6 flex flex-col
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
        group
      "
    >
      {/* LOGO */}
      <div
        className="
          h-40 flex flex-col items-center justify-center
          bg-gray-50 rounded-xl mb-4 gap-2
          overflow-hidden
        "
      >
        <img
          src={logo?.url || "/placeholder-logo.png"}
          alt={`${name} logo`}
          className="
            max-h-35 object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
        />

        {isEditing && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
              className="text-xs sm:text-sm"
            />

            <button
              onClick={handleLogoUpload}
              disabled={!logoFile || loadingLogo}
              className="
                flex items-center gap-1 text-xs
                bg-indigo-600 text-white px-3 py-1 rounded
                hover:bg-indigo-700 transition
                disabled:opacity-50
              "
            >
              <Upload size={12} />
              {loadingLogo ? "Uploading..." : "Upload Logo"}
            </button>
          </>
        )}
      </div>

      {/* NAME */}
      <h3 className=" text-sm sm:text-lg font-semibold text-gray-900 mb-2">
        {name}
      </h3>

      {/* DESCRIPTION */}
      {isEditing ? (
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="
            text-xs sm:text-sm border rounded p-2 mb-3
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
          rows={3}
        />
      ) : (
        description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-4">
            {description}
          </p>
        )
      )}

      {/* WEBSITE */}
      {isEditing ? (
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          className="
            text-sm border rounded px-2 py-1 mb-3
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
          placeholder="Website URL"
        />
      ) : (
        website && (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-1 text-sm
              text-indigo-600 mb-3
              hover:underline
            "
          >
            Visit Website <ExternalLink size={14} />
          </a>
        )
      )}

      {/* ACTIONS */}
      <div className="mt-auto flex gap-2 pt-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="
                flex items-center gap-1 text-sm
                bg-green-600 text-white px-3 py-1 rounded
                hover:bg-green-700 transition
              "
            >
              <Save size={14} /> Save
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setLogoFile(null);
                setForm({
                  description: description || "",
                  website: website || "",
                });
              }}
              className="
                flex items-center gap-1 text-sm
                bg-gray-200 px-3 py-1 rounded
                hover:bg-gray-300 transition
              "
            >
              <X size={14} /> Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="
              flex items-center gap-1 text-sm
              bg-indigo-600 text-white px-3 py-1 rounded
              hover:bg-indigo-700 transition
            "
          >
            <Pencil size={14} /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CollegeCard;
