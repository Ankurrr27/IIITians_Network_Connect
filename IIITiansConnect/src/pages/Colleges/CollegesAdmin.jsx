import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ExternalLink,
  Images,
  ImagePlus,
  Link2,
  Pencil,
  Upload,
  Users,
} from "lucide-react";
import api from "../../api/axios";
import ImageCropModal from "../../components/ImageCropModal";

const COLLEGE_PLACEHOLDER = "/placeholder.svg";

const initialCollegeForm = {
  name: "",
  website: "",
  clubLink: "",
  clubLinks: [{ name: "", url: "" }],
  description: "",
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

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function CollegesAdmin() {
  const [colleges, setColleges] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [collegeLoading, setCollegeLoading] = useState(true);
  const [collegeState, setCollegeState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const [createCollegeForm, setCreateCollegeForm] = useState(initialCollegeForm);
  const [createPhotoFile, setCreatePhotoFile] = useState(null);
  const [createGalleryFiles, setCreateGalleryFiles] = useState([]);
  const [createLogoFile, setCreateLogoFile] = useState(null);

  const [rawAssetFile, setRawAssetFile] = useState(null);
  const [assetTarget, setAssetTarget] = useState("create-logo");

  const [editCollegeId, setEditCollegeId] = useState("");
  const [editCollegeForm, setEditCollegeForm] = useState(initialCollegeForm);
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [editGalleryFiles, setEditGalleryFiles] = useState([]);
  const [editLogoFile, setEditLogoFile] = useState(null);

  const loadCollegeData = async () => {
    setCollegeLoading(true);
    setCollegeState((prev) => ({ ...prev, error: "" }));
    const requestNonce = Date.now();

    try {
      const [collegesResponse, teamResponse] = await Promise.all([
        api.get("/colleges", {
          params: { _: requestNonce },
          headers: { "Cache-Control": "no-cache" },
        }),
        api.get("/team"),
      ]);

      setColleges(collegesResponse.data || []);
      setTeamMembers(teamResponse.data || []);
    } catch (err) {
      setCollegeState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Could not load colleges.",
      }));
    } finally {
      setCollegeLoading(false);
    }
  };

  useEffect(() => {
    loadCollegeData();
  }, []);

  const teamCountMap = useMemo(() => {
    const map = new Map();

    teamMembers.forEach((member) => {
      const key = (member.iiit || "").trim().toLowerCase();
      if (!key) return;

      const uniqueMemberKey =
        (member.email || "").trim().toLowerCase() ||
        `${(member.name || "").trim().toLowerCase()}::${key}`;

      if (!uniqueMemberKey) return;

      if (!map.has(key)) {
        map.set(key, new Set());
      }

      map.get(key).add(uniqueMemberKey);
    });

    return map;
  }, [teamMembers]);

  const getCollegeTeamCount = (collegeName) =>
    teamCountMap.get((collegeName || "").trim().toLowerCase())?.size || 0;

  const sanitizeClubLinks = (links = []) =>
    links
      .map((item) => ({
        name: (item?.name || "").trim(),
        url: (item?.url || "").trim(),
      }))
      .filter((item) => item.name && item.url);

  const uploadCollegeAsset = async (collegeId, type, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append(type, file);
    await api.patch(`/colleges/${collegeId}/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const uploadCollegeGallery = async (collegeId, files) => {
    if (!files?.length) return;
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    await api.patch(`/colleges/${collegeId}/gallery`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleCreateCollegeChange = (event) => {
    setCreateCollegeForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditCollegeChange = (event) => {
    setEditCollegeForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCreateClubLinkChange = (index, field, value) => {
    setCreateCollegeForm((prev) => ({
      ...prev,
      clubLinks: prev.clubLinks.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleEditClubLinkChange = (index, field, value) => {
    setEditCollegeForm((prev) => ({
      ...prev,
      clubLinks: prev.clubLinks.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addCreateClubLinkRow = () => {
    setCreateCollegeForm((prev) => ({
      ...prev,
      clubLinks: [...prev.clubLinks, { name: "", url: "" }],
    }));
  };

  const addEditClubLinkRow = () => {
    setEditCollegeForm((prev) => ({
      ...prev,
      clubLinks: [...prev.clubLinks, { name: "", url: "" }],
    }));
  };

  const removeCreateClubLinkRow = (index) => {
    setCreateCollegeForm((prev) => ({
      ...prev,
      clubLinks:
        prev.clubLinks.length === 1
          ? [{ name: "", url: "" }]
          : prev.clubLinks.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removeEditClubLinkRow = (index) => {
    setEditCollegeForm((prev) => ({
      ...prev,
      clubLinks:
        prev.clubLinks.length === 1
          ? [{ name: "", url: "" }]
          : prev.clubLinks.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const openCropper = (file, target) => {
    setAssetTarget(target);
    setRawAssetFile(file);
  };

  const handleCreateCollege = async (event) => {
    event.preventDefault();
    if (collegeState.loading) return;

    setCollegeState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const response = await api.post("/colleges", {
        ...createCollegeForm,
        clubLinks: sanitizeClubLinks(createCollegeForm.clubLinks),
      });
      await uploadCollegeAsset(response.data._id, "photo", createPhotoFile);
      await uploadCollegeGallery(response.data._id, createGalleryFiles);
      await uploadCollegeAsset(response.data._id, "logo", createLogoFile);

      setCreateCollegeForm(initialCollegeForm);
      setCreatePhotoFile(null);
      setCreateGalleryFiles([]);
      setCreateLogoFile(null);
      setCollegeState({
        loading: false,
        error: "",
        success: "College added successfully.",
      });
      await loadCollegeData();
    } catch (err) {
      setCollegeState({
        loading: false,
        success: "",
        error: err.response?.data?.message || "Could not add college.",
      });
    }
  };

  const startEditCollege = (college) => {
    setEditCollegeId(college._id);
    setEditCollegeForm({
      name: college.name || "",
      website: college.website || "",
      clubLink: college.clubLink || "",
      clubLinks:
        college.clubLinks?.length > 0
          ? college.clubLinks.map((item) => ({
              name: item.name || "",
              url: item.url || "",
            }))
          : [{ name: "", url: "" }],
      description: college.description || "",
    });
    setEditPhotoFile(null);
    setEditGalleryFiles([]);
    setEditLogoFile(null);
    setCollegeState({
      loading: false,
      error: "",
      success: "",
    });
  };

  const cancelEditCollege = () => {
    setEditCollegeId("");
    setEditCollegeForm(initialCollegeForm);
    setEditPhotoFile(null);
    setEditGalleryFiles([]);
    setEditLogoFile(null);
  };

  const handleUpdateCollege = async (id) => {
    if (collegeState.loading) return;

    setCollegeState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      await api.patch(`/colleges/${id}`, {
        name: editCollegeForm.name,
        website: editCollegeForm.website,
        clubLink: editCollegeForm.clubLink,
        clubLinks: sanitizeClubLinks(editCollegeForm.clubLinks),
        description: editCollegeForm.description,
      });

      await uploadCollegeAsset(id, "photo", editPhotoFile);
      await uploadCollegeGallery(id, editGalleryFiles);
      await uploadCollegeAsset(id, "logo", editLogoFile);

      setEditCollegeId("");
      setEditCollegeForm(initialCollegeForm);
      setEditPhotoFile(null);
      setEditGalleryFiles([]);
      setEditLogoFile(null);
      setCollegeState({
        loading: false,
        error: "",
        success: "College updated successfully.",
      });
      await loadCollegeData();
    } catch (err) {
      setCollegeState({
        loading: false,
        success: "",
        error: err.response?.data?.message || "Could not update college.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
              <Building2 className="h-4 w-4" />
              Colleges Workspace
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Manage Colleges
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Keep each institute ready with a card photo, a reusable logo,
              useful links, and up-to-date network presence.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Colleges" value={colleges.length} />
            <MetricCard label="With photos" value={colleges.filter((c) => c.photo?.url || (c.gallery?.length || 0) > 0 || c.logo?.url).length} />
            <MetricCard label="With logos" value={colleges.filter((c) => c.logo?.url).length} />
          </div>
        </div>
      </section>

      {collegeState.error && <StatusMessage tone="error">{collegeState.error}</StatusMessage>}
      {collegeState.success && <StatusMessage tone="success">{collegeState.success}</StatusMessage>}

      <section className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Add college</h2>
        </div>

        <form onSubmit={handleCreateCollege} className="grid gap-3 lg:grid-cols-[1.05fr_1.05fr_1fr_1fr_1fr_1.2fr_auto] lg:items-start">
          <input
            type="text"
            name="name"
            placeholder="e.g. IIIT Kota"
            value={createCollegeForm.name}
            onChange={handleCreateCollegeChange}
            required
            className="w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <input
            type="text"
            name="website"
            placeholder="e.g. https://iiitkota.ac.in"
            value={createCollegeForm.website}
            onChange={handleCreateCollegeChange}
            className="w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <input
            type="text"
            name="clubLink"
            placeholder="e.g. https://students.iiitkota.ac.in"
            value={createCollegeForm.clubLink}
            onChange={handleCreateCollegeChange}
            className="w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <AssetInlinePicker
            title="Main college photo"
            file={createPhotoFile}
            onPick={(file) => openCropper(file, "create-photo")}
          />
          <MultiAssetInlinePicker
            title="College photos"
            files={createGalleryFiles}
            onPick={(files) =>
              setCreateGalleryFiles((prev) => [...prev, ...files])
            }
          />
          <AssetInlinePicker
            title="College logo"
            file={createLogoFile}
            onPick={(file) => openCropper(file, "create-logo")}
          />
          <button
            type="submit"
            disabled={collegeState.loading}
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 lg:min-w-[140px]"
          >
            {collegeState.loading ? "Saving..." : "Add"}
          </button>
        </form>

        <textarea
          name="description"
          rows={4}
          placeholder="e.g. A fast-growing IIIT known for strong coding culture, active communities, and national-level student events."
          value={createCollegeForm.description}
          onChange={handleCreateCollegeChange}
          className="mt-3 w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />

        <div className="mt-3 rounded-[1.4rem] bg-slate-50/90 p-4 ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Clubs and societies</div>
              <div className="text-xs text-slate-500">Add named links so each society appears directly on the college card.</div>
            </div>
            <button
              type="button"
              onClick={addCreateClubLinkRow}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Add link
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {createCollegeForm.clubLinks.map((item, index) => (
              <div key={`create-club-link-${index}`} className="grid gap-3 md:grid-cols-[0.8fr_1.2fr_auto]">
                <input
                  type="text"
                  placeholder="e.g. GDSC IIIT Kota"
                  value={item.name}
                  onChange={(event) =>
                    handleCreateClubLinkChange(index, "name", event.target.value)
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
                <input
                  type="text"
                  placeholder="e.g. https://instagram.com/gdsciiitkota"
                  value={item.url}
                  onChange={(event) =>
                    handleCreateClubLinkChange(index, "url", event.target.value)
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => removeCreateClubLinkRow(index)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Edit colleges</h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {collegeLoading ? (
              <StatusMessage>Loading colleges...</StatusMessage>
            ) : colleges.length === 0 ? (
              <StatusMessage>No colleges found yet.</StatusMessage>
            ) : (
              colleges.map((college) => {
                const isEditing = editCollegeId === college._id;
                const existingGallery = college.gallery || [];
                const coverPhotos = [
                  ...(college.photo?.url ? [college.photo] : []),
                  ...existingGallery,
                ];
                const coverImage =
                  college.photo?.url ||
                  existingGallery[0]?.url ||
                  COLLEGE_PLACEHOLDER;
                const mainPhotoUrl =
                  (editPhotoFile && isEditing
                    ? URL.createObjectURL(editPhotoFile)
                    : college.photo?.url) || COLLEGE_PLACEHOLDER;
                const logoUrl = editLogoFile && isEditing
                  ? URL.createObjectURL(editLogoFile)
                  : college.logo?.url || COLLEGE_PLACEHOLDER;

                return (
                  <div
                    key={college._id}
                    className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-50">
                      <img
                        src={coverImage}
                        alt={`${college.name} college`}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="space-y-4 bg-white p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
                              <img
                                src={logoUrl}
                                alt={`${college.name} logo`}
                                className="h-8 w-8 object-contain"
                              />
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-slate-900">
                                {college.name}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/70">
                                  <Images className="h-3.5 w-3.5" />
                                  {coverPhotos.length
                                    ? `${coverPhotos.length} college photo${coverPhotos.length > 1 ? "s" : ""}`
                                    : college.logo?.url
                                      ? "Using logo as current cover"
                                    : "No college photos"}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/70">
                                  <ImagePlus className="h-3.5 w-3.5" />
                                  {college.logo?.url ? "College logo added" : "No college logo"}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/80">
                                  <Users className="h-3.5 w-3.5" />
                                  {getCollegeTeamCount(college.name)} team members
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => (isEditing ? cancelEditCollege() : startEditCollege(college))}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                            isEditing
                              ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          <Pencil className="h-4 w-4" />
                          {isEditing ? "Cancel" : "Edit"}
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <AssetPicker
                              title="Main college photo"
                              helper="This is the large public cover image. It stays separate from the logo."
                              file={editPhotoFile}
                              existingUrl={mainPhotoUrl}
                              fallback={COLLEGE_PLACEHOLDER}
                              onPick={(file) => openCropper(file, "edit-photo")}
                            />
                            <AssetPicker
                              title="College logo"
                              helper="Smaller identity mark used near the college name only."
                              file={editLogoFile}
                              existingUrl={logoUrl}
                              fallback={COLLEGE_PLACEHOLDER}
                              onPick={(file) => openCropper(file, "edit-logo")}
                            />
                          </div>
                          <MultiAssetPicker
                            title="Extra gallery photos"
                            helper="Add more campus visuals. These support the main photo and do not replace the logo."
                            files={editGalleryFiles}
                            existingUrls={existingGallery.map((item) => item.url)}
                            onPick={(files) =>
                              setEditGalleryFiles((prev) => [...prev, ...files])
                            }
                          />

                          <input
                            type="text"
                            name="name"
                            value={editCollegeForm.name}
                            onChange={handleEditCollegeChange}
                            placeholder="e.g. IIIT Kota"
                            className="w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base"
                          />
                          <input
                            type="text"
                            name="website"
                            value={editCollegeForm.website}
                            onChange={handleEditCollegeChange}
                            placeholder="e.g. https://iiitkota.ac.in"
                            className="w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base"
                          />
                          <input
                            type="text"
                            name="clubLink"
                            value={editCollegeForm.clubLink}
                            onChange={handleEditCollegeChange}
                            placeholder="e.g. https://students.iiitkota.ac.in"
                            className="w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base"
                          />
                          <div className="rounded-[1.4rem] bg-slate-50/90 p-4 ring-1 ring-slate-200/80">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-slate-900">Clubs and societies</div>
                                <div className="text-xs text-slate-500">Named links shown directly on the public college card.</div>
                              </div>
                              <button
                                type="button"
                                onClick={addEditClubLinkRow}
                                className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                              >
                                Add link
                              </button>
                            </div>

                            <div className="mt-3 space-y-3">
                              {editCollegeForm.clubLinks.map((item, index) => (
                                <div key={`edit-club-link-${index}`} className="grid gap-3 md:grid-cols-[0.8fr_1.2fr_auto]">
                                  <input
                                    type="text"
                                    placeholder="e.g. E-Cell IIIT Kota"
                                    value={item.name}
                                    onChange={(event) =>
                                      handleEditClubLinkChange(index, "name", event.target.value)
                                    }
                                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                                  />
                                  <input
                                    type="text"
                                    placeholder="e.g. https://linktr.ee/ecelliiitkota"
                                    value={item.url}
                                    onChange={(event) =>
                                      handleEditClubLinkChange(index, "url", event.target.value)
                                    }
                                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeEditClubLinkRow(index)}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <textarea
                            name="description"
                            rows={4}
                            value={editCollegeForm.description}
                            onChange={handleEditCollegeChange}
                            placeholder="e.g. IIIT Kota has active tech, cultural, and entrepreneurial communities with strong placement and event participation."
                            className="w-full rounded-2xl border border-stone-200 bg-[#fffaf2] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleUpdateCollege(college._id)}
                              disabled={collegeState.loading}
                              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Pencil className="h-4 w-4" />
                              Save changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {college.description ? (
                            <p className="text-sm leading-7 text-slate-600">
                              {college.description}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-400">
                              No description added yet.
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {college.website && (
                              <a
                                href={college.website}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 transition hover:bg-indigo-100"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Website
                              </a>
                            )}
                            {college.clubLinks?.length > 0
                              ? college.clubLinks
                                  .filter((item) => item?.name && item?.url)
                                  .map((item, index) => (
                                    <a
                                      key={`${item.name}-${index}`}
                                      href={item.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-200"
                                    >
                                      <Link2 className="h-4 w-4" />
                                      {item.name}
                                    </a>
                                  ))
                              : college.clubLink && (
                                  <a
                                    href={college.clubLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-200"
                                  >
                                    <Link2 className="h-4 w-4" />
                                    Club link
                                  </a>
                                )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
      </section>

      {rawAssetFile && (
        <ImageCropModal
          file={rawAssetFile}
          aspect={assetTarget.includes("photo") ? 16 / 9 : 1}
          onClose={() => setRawAssetFile(null)}
          onCrop={(croppedFile) => {
            if (assetTarget === "create-photo") setCreatePhotoFile(croppedFile);
            if (assetTarget === "create-logo") setCreateLogoFile(croppedFile);
            if (assetTarget === "edit-photo") setEditPhotoFile(croppedFile);
            if (assetTarget === "edit-logo") setEditLogoFile(croppedFile);
            setRawAssetFile(null);
          }}
        />
      )}
    </div>
  );
}

function AssetPicker({ title, helper, file, existingUrl, fallback, onPick }) {
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl || fallback;

  return (
    <div className="rounded-[1.4rem] bg-slate-50/90 p-4 ring-1 ring-slate-200/80">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80">
          <img src={previewUrl} alt={title} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-2">
          <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <div className="text-xs leading-5 text-slate-500">{helper}</div>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            <Upload className="h-4 w-4" />
            {file ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                if (selected) onPick(selected);
                event.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function AssetInlinePicker({ title, file, onPick }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-white hover:ring-indigo-200">
      <span className="font-medium">{file ? `${title} ready` : title}</span>
      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
        <Upload className="mr-1 inline h-3.5 w-3.5" />
        Upload
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onPick(selected);
          event.target.value = "";
        }}
      />
    </label>
  );
}

function MultiAssetInlinePicker({ title, files = [], onPick }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-white hover:ring-indigo-200">
      <span className="font-medium">
        {files.length ? `${files.length} ${title.toLowerCase()} ready` : title}
      </span>
      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
        <Upload className="mr-1 inline h-3.5 w-3.5" />
        Add
      </span>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const selected = Array.from(event.target.files || []);
          if (selected.length) onPick(selected);
          event.target.value = "";
        }}
      />
    </label>
  );
}

function MultiAssetPicker({ title, helper, files = [], existingUrls = [], onPick }) {
  const previewUrls = [
    ...existingUrls,
    ...files.map((file) => URL.createObjectURL(file)),
  ];

  return (
    <div className="rounded-[1.4rem] bg-slate-50/90 p-4 ring-1 ring-slate-200/80">
      <div className="space-y-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-xs leading-5 text-slate-500">{helper}</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(previewUrls.length ? previewUrls : [COLLEGE_PLACEHOLDER]).slice(0, 6).map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80"
            >
              <img src={url} alt={`${title} ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
          <Upload className="h-4 w-4" />
          Add more photos
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              const selected = Array.from(event.target.files || []);
              if (selected.length) onPick(selected);
              event.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
