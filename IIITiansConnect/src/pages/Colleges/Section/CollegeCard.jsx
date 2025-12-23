import { ExternalLink, Pencil, Save, X, Upload } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";
import Cropper from "react-easy-crop";

const CollegeCard = ({ college, onUpdated }) => {
  const { _id, name, logo, description, website } = college;

  // 🖼️ crop states
  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
const [freeCrop, setFreeCrop] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);

  // ✅ AUTH CHECK (ADMIN ONLY)
  const isAdminLoggedIn = Boolean(localStorage.getItem("adminToken"));

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
    if (!logoFile || !isAdminLoggedIn) return;

    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      setLoadingLogo(true);
      const res = await api.patch(`/colleges/${_id}/logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
    if (!isAdminLoggedIn) return;

    try {
      const res = await api.patch(`/colleges/${_id}`, form);
      onUpdated(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((r) => (image.onload = r));

    const canvas = document.createElement("canvas");
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg")
    );
  };

  const handleCropSave = async () => {
    const blob = await getCroppedImg(cropSrc, croppedAreaPixels);
    setLogoFile(new File([blob], "logo.jpg", { type: "image/jpeg" }));
    setCropSrc(null);
  };

  return (
    <div
      className="
        bg-white border rounded-lg sm:rounded-2xl p-2 sm:p-0 flex flex-col
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
        group
      "
    >
      {/* LOGO */}
      <div
        className="
    relative h-40
    bg-gray-100
    overflow-hidden
    mb-4
    rounded-t-lg
  "
      >
        {/* LOGO */}
        <img
          src={logo?.url || "/placeholder-logo.png"}
          alt={`${name} logo`}
          className="
      w-full h-auto
      object-contain
      transition-transform duration-500
      group-hover:scale-[1.06]
    "
        />

        {/* SUBTLE HOVER OVERLAY */}
        <div
          className="
      absolute inset-0
      bg-gradient-to-t from-black/10 to-transparent
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
      pointer-events-none
    "
        />

        {/* ADMIN CONTROLS */}
        {isEditing && isAdminLoggedIn && (
          <div
            className="
        absolute bottom-2 left-1/2 -translate-x-1/2
        flex flex-col items-center gap-1
        bg-white/90 backdrop-blur
        px-3 py-2 rounded-lg
        shadow
      "
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => setCropSrc(reader.result);
                reader.readAsDataURL(file);
              }}
              className="text-[11px]"
            />

            <button
              onClick={handleLogoUpload}
              disabled={!logoFile || loadingLogo}
              className="
          flex items-center gap-1 text-[11px]
          bg-indigo-600 text-white px-3 py-1 rounded
          hover:bg-indigo-700 transition
          disabled:opacity-50
        "
            >
              <Upload size={12} />
              {loadingLogo ? "Uploading…" : "Upload"}
            </button>
          </div>
        )}
      </div>
      <div
        className=" bg-white rounded-lg sm:rounded-2xl p-2 sm:p-6 flex flex-col
        transition-all duration-300 ease-out
        hover:-translate-y-1 
        group"
      >
        {/* NAME */}
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">
          {name}
        </h3>

        {/* DESCRIPTION */}
        {isEditing && isAdminLoggedIn ? (
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
        {isEditing && isAdminLoggedIn ? (
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

        {/* ACTIONS (ADMIN ONLY) */}
        {isAdminLoggedIn && (
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
        )}
      </div>

     {cropSrc && (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
    <div className="bg-white w-[90vw] max-w-md p-4 rounded-xl">
      
      {/* CROP AREA */}
      <div className="relative h-64">
        <Cropper
          image={cropSrc}
          crop={crop}
          zoom={zoom}
          aspect={freeCrop ? undefined : 52 / 21} // 🔥 match banner ratio
          restrictPosition={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* CONTROLS */}
      <div className="mt-4 flex items-center justify-between">
        {/* FREE / LOCKED TOGGLE */}
        <button
          onClick={() => setFreeCrop((v) => !v)}
          className="text-xs text-indigo-600 hover:underline"
        >
          {freeCrop ? "Lock to banner ratio (3:2)" : "Free crop"}
        </button>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            onClick={() => setCropSrc(null)}
            className="px-3 py-1 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCropSave}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CollegeCard;
