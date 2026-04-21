import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images,
  Search,
  Camera,
  MapPin,
  ExternalLink,
  X,
  History,
  Building2,
  Users,
  Sparkles,
  Upload,
  Send,
} from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import useThemeMode from "../../hooks/useThemeMode.jsx";
import { notifyPageEntry } from "../../utils/appNotifications";

const categories = [
  { id: "all", label: "All Photos", icon: <Images size={16} /> },
  { id: "infrastructure", label: "Infrastructure", icon: <Building2 size={16} /> },
  { id: "clubs", label: "Clubs", icon: <Users size={16} /> },
  { id: "events", label: "Events", icon: <Sparkles size={16} /> },
  { id: "others", label: "Others", icon: <History size={16} /> },
];

function optimizeCloudinaryImage(url, transformations) {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transformations}/`);
}

export default function GalleryPage() {
  const { isDarkMode } = useThemeMode();
  const { collegeName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploadCollegeId, setUploadCollegeId] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState("others");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const normalizedCollegeName = useMemo(
    () => (collegeName ? decodeURIComponent(collegeName).toLowerCase() : ""),
    [collegeName]
  );

  // Open photo by index and update URL
  const openPhoto = (photo, index) => {
    setSelectedImage({ ...photo, index });
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("photo", String(index));
      return next;
    }, { replace: true });
  };

  const closePhoto = () => {
    setSelectedImage(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("photo");
      return next;
    }, { replace: true });
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    notifyPageEntry(
      collegeName ? `${collegeName} Gallery Loaded` : "Gallery Loaded",
      collegeName ? `Explore the visual journey of ${collegeName}.` : "Explore the visual journey of IIITs.",
      "gallery-page-loaded"
    );

    const fetchGallery = async () => {
      try {
        const res = await api.get("/colleges");
        setColleges(res.data || []);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (!collegeName || colleges.length === 0 || uploadCollegeId) return;

    const matchedCollege = colleges.find(
      (college) =>
        college.name?.toLowerCase() === normalizedCollegeName
    );

    if (matchedCollege?._id) {
      setUploadCollegeId(matchedCollege._id);
    }
  }, [collegeName, colleges, normalizedCollegeName, uploadCollegeId]);

  const allPhotos = useMemo(() => {
    const photos = colleges.flatMap((college) =>
      (college.gallery || []).map((img) => ({
        ...img,
        collegeName: college.name,
        collegeId: college._id,
      }))
    );
    
    // Sort latest-first.
    // New photos have createdAt; old ones don't — fall back to the time
    // encoded in the MongoDB ObjectId (first 8 hex chars = Unix seconds).
    const getTime = (photo) => {
      if (photo.createdAt) return new Date(photo.createdAt).getTime();
      if (photo._id && typeof photo._id === "string" && photo._id.length >= 8) {
        return parseInt(photo._id.substring(0, 8), 16) * 1000;
      }
      return 0;
    };
    return photos.sort((a, b) => getTime(b) - getTime(a));
  }, [colleges]);

  const scopedPhotos = useMemo(() => {
    if (!normalizedCollegeName) return allPhotos;
    return allPhotos.filter(
      (photo) => photo.collegeName?.toLowerCase() === normalizedCollegeName
    );
  }, [allPhotos, normalizedCollegeName]);

  const categoryCounts = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category.id] =
          category.id === "all"
            ? scopedPhotos.length
            : scopedPhotos.filter((photo) => photo.category === category.id).length;
        return acc;
      },
      {}
    );
  }, [scopedPhotos]);

  const filteredPhotos = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return scopedPhotos.filter((photo) => {
      const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory;
      const matchesSearch = 
        photo.caption?.toLowerCase().includes(query) ||
        (!normalizedCollegeName && photo.collegeName?.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [scopedPhotos, selectedCategory, searchQuery, normalizedCollegeName]);

  // On load or filteredPhotos change, auto-open photo from URL param
  useEffect(() => {
    const photoIndex = parseInt(searchParams.get("photo"));
    if (!isNaN(photoIndex) && filteredPhotos[photoIndex]) {
      setSelectedImage({ ...filteredPhotos[photoIndex], index: photoIndex });
    }
  }, [filteredPhotos]); // eslint-disable-line

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;
    const handler = (e) => {
      if (e.key === "Escape") closePhoto();
      if (e.key === "ArrowRight") {
        const next = (selectedImage.index + 1) % filteredPhotos.length;
        openPhoto(filteredPhotos[next], next);
      }
      if (e.key === "ArrowLeft") {
        const prev = (selectedImage.index - 1 + filteredPhotos.length) % filteredPhotos.length;
        openPhoto(filteredPhotos[prev], prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImage, filteredPhotos]);

  if (loading) return <GallerySkeleton />;

  const handleUploadSubmit = async (event) => {
    event.preventDefault();

    if (!uploadCollegeId || uploadFiles.length === 0) {
      setUploadMessage({
        type: "error",
        text: "Please choose a college and at least one image.",
      });
      return;
    }

    setUploading(true);
    setUploadMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      uploadFiles.forEach((file) => formData.append("images", file));
      uploadFiles.forEach(() => formData.append("captions", uploadCaption));
      uploadFiles.forEach(() => formData.append("categories", uploadCategory));

      await api.patch(`/colleges/${uploadCollegeId}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const res = await api.get("/colleges");
      setColleges(res.data || []);
      setUploadCaption("");
      setUploadCategory("others");
      setUploadFiles([]);
      setUploadMessage({
        type: "success",
        text: "Thanks. Your images were added to the gallery.",
      });
    } catch (err) {
      setUploadMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to upload images.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16 pt-20 sm:pb-20 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header — matches CollegesHeader style */}
        <div className="mb-6 flex flex-col items-start px-2 text-left sm:mb-12 sm:items-center sm:px-0 sm:text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm sm:text-[11px] sm:tracking-[0.24em]">
            <Images className="h-4 w-4" />
            Photo Gallery
          </div>
          <h1 className="mt-3 text-[2.15rem] font-semibold leading-none tracking-tight text-slate-900 sm:mt-4 sm:text-5xl">
            {collegeName
              ? <>{decodeURIComponent(collegeName)} <span className="text-indigo-600">Gallery</span></>
              : <>IIIT <span className="text-indigo-600">Gallery</span></>}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-4 sm:max-w-2xl sm:text-base sm:leading-7">
            {collegeName
              ? `Explore photos from ${decodeURIComponent(collegeName)}.`
              : "Explore photos from across the IIIT network."}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all sm:px-4 sm:text-xs ${
                    selectedCategory === cat.id
                      ? "bg-indigo-700 text-white shadow-sm"
                      : "border border-indigo-100 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                  <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>{categoryCounts[cat.id] || 0}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:py-2"
            />
          </div>
        </div>

        <section className="mb-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.1),_transparent_32%),linear-gradient(180deg,_#f8faff_0%,_#ffffff_100%)] p-4 shadow-[0_20px_60px_-35px_rgba(99,102,241,0.35)] sm:mb-10 sm:rounded-[2rem] sm:p-6">
          {!showUploadForm ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 sm:h-11 sm:w-11">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Add image</div>
                  <p className="mt-1 max-w-[15rem] text-sm leading-6 text-slate-600 sm:max-w-none">
                    Share a campus photo with category and caption.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#4f46e5,_#4338ca)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(79,70,229,0.9)] transition hover:translate-y-[-1px] sm:px-5"
              >
                <Upload className="h-4 w-4" />
                Add Image
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700 ring-1 ring-indigo-100">
                  <Upload className="h-3.5 w-3.5" />
                  Community Upload
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Add photos to the gallery
                </h2>
                <p className="max-w-md text-sm leading-7 text-slate-600">
                  Upload campus moments with the right category so the gallery stays useful and easy to browse.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Visible</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{scopedPhotos.length}</div>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Latest</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{categoryCounts.events || 0}</div>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Clubs</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{categoryCounts.clubs || 0}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.5)] backdrop-blur md:p-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    value={uploadCollegeId}
                    onChange={(event) => setUploadCollegeId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select college</option>
                    {colleges.map((college) => (
                      <option key={college._id} value={college._id}>
                        {college.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={uploadCategory}
                    onChange={(event) => setUploadCategory(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="clubs">Clubs</option>
                    <option value="events">Events</option>
                    <option value="others">Others</option>
                  </select>

                  <input
                    type="text"
                    value={uploadCaption}
                    onChange={(event) => setUploadCaption(event.target.value)}
                    placeholder="Add a caption for these photos"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 md:col-span-2"
                  />

                  <label className="flex min-h-[68px] cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-white md:col-span-2">
                    <span className="pr-3">
                      {uploadFiles.length
                        ? `${uploadFiles.length} image${uploadFiles.length > 1 ? "s" : ""} selected`
                        : "Choose one or more images"}
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      Browse
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        setUploadFiles(Array.from(event.target.files || []));
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#4f46e5,_#4338ca)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(79,70,229,0.9)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_45px_-22px_rgba(79,70,229,0.95)] disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Submit Photos"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {uploadMessage.text && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
                uploadMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
              }`}
            >
              {uploadMessage.text}
            </div>
          )}
        </section>

        {/* Photo Grid */}
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.url + index}
              onClick={() => openPhoto(photo, index)}
              className="group relative mb-5 inline-block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden bg-slate-100">
                <img
                  src={optimizeCloudinaryImage(photo.url, "f_auto,q_auto,w_900")}
                  alt={photo.caption || "Gallery photo"}
                  className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>

              <div className="space-y-2 px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                    {photo.category || "uncategorized"}
                  </span>
                  {!collegeName && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin size={11} />
                      {photo.collegeName}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-900">
                  {photo.caption || "Untitled memory"}
                </p>
                <p className="text-xs text-slate-500">
                  Click to view full photo
                </p>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Original ratio
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="rounded-full bg-slate-100 p-8 text-slate-300">
              <Camera size={48} />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">No photos found</h3>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl ${
              isDarkMode ? "bg-slate-950/92" : "bg-slate-100/85"
            }`}
            onClick={closePhoto}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative max-w-5xl w-full overflow-hidden rounded-3xl shadow-2xl ${
                isDarkMode
                  ? "bg-slate-900"
                  : "border border-slate-200 bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closePhoto}
                className={`absolute right-6 top-6 z-10 rounded-full p-2 backdrop-blur-md transition ${
                  isDarkMode
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <X size={24} />
              </button>

              {/* Prev / Next arrows */}
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    onClick={() => { const p = (selectedImage.index - 1 + filteredPhotos.length) % filteredPhotos.length; openPhoto(filteredPhotos[p], p); }}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 backdrop-blur-md transition md:left-6 ${
                      isDarkMode
                        ? "bg-white/10 text-white hover:bg-white/25"
                        : "bg-white/90 text-slate-700 shadow-md hover:bg-white"
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button
                    onClick={() => { const n = (selectedImage.index + 1) % filteredPhotos.length; openPhoto(filteredPhotos[n], n); }}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 backdrop-blur-md transition md:right-[34%] ${
                      isDarkMode
                        ? "bg-white/10 text-white hover:bg-white/25"
                        : "bg-white/90 text-slate-700 shadow-md hover:bg-white"
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </>
              )}

              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Image */}
                <div className={`w-full md:w-2/3 h-[68vh] md:h-auto relative ${
                  isDarkMode ? "bg-black" : "bg-slate-100"
                }`}>
                  <motion.img
                    key={selectedImage.url}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={selectedImage.url}
                    alt={selectedImage.caption}
                    className="h-full w-full object-contain"
                    loading="eager"
                    decoding="async"
                  />
                  {/* Photo counter */}
                  <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-bold backdrop-blur-md ${
                    isDarkMode
                      ? "bg-black/50 text-white"
                      : "bg-white/90 text-slate-800 shadow-sm"
                  }`}>
                    {selectedImage.index + 1} / {filteredPhotos.length}
                  </div>
                </div>

                {/* Sidebar info */}
                <div className={`w-full md:w-1/3 flex flex-col justify-between overflow-y-auto ${
                  isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
                }`}>
                  {/* Compact mobile header */}
                  <div className="px-4 py-3 md:p-8">
                    {/* Category + metadata row (compact on mobile) */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ring-1 ${
                        isDarkMode
                          ? "bg-indigo-600/20 text-indigo-400 ring-indigo-600/30"
                          : "bg-indigo-50 text-indigo-700 ring-indigo-100"
                      }`}>
                        {selectedImage.category || "uncategorized"}
                      </span>
                      {/* inline meta on mobile */}
                      <span className="text-[11px] text-slate-500 md:hidden">
                        {selectedImage.collegeName}
                      </span>
                      <span className="text-[11px] text-slate-400 md:hidden">·</span>
                      <span className="text-[11px] text-slate-500 md:hidden">
                        {selectedImage.createdAt
                          ? new Date(selectedImage.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : "Unknown date"}
                      </span>
                    </div>

                    <h2 className="mt-2 text-base font-semibold leading-snug md:mt-6 md:text-2xl md:font-bold">
                      {selectedImage.caption || "Untitled Memory"}
                    </h2>

                    {/* Full metadata — desktop only */}
                    <div className="mt-6 hidden space-y-4 md:block">
                      <div className="flex items-center gap-4 font-medium">
                        <Building2 size={20} className="text-indigo-500 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Institute</p>
                          <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{selectedImage.collegeName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 font-medium">
                        <History size={20} className="text-indigo-500 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Captured On</p>
                          <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {selectedImage.createdAt
                              ? new Date(selectedImage.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="border-t border-slate-100 px-4 py-3 space-y-2 md:border-0 md:px-8 md:pb-8 md:pt-0 md:mt-10 md:space-y-3">
                    <button
                      onClick={copyShareUrl}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl md:rounded-2xl border py-2.5 md:py-3.5 text-sm font-semibold md:font-extrabold transition ${
                        copied
                          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                          : isDarkMode
                            ? "border-white/10 bg-white/10 text-white hover:bg-white/20"
                            : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      {copied ? (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Link Copied!</>
                      ) : (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Share Photo URL</>
                      )}
                    </button>
                    <button
                      onClick={() => window.open(selectedImage.url, '_blank')}
                      className={`group flex w-full items-center justify-center gap-2 rounded-xl md:rounded-2xl py-2.5 md:py-3.5 text-sm font-semibold md:font-extrabold transition ${
                        isDarkMode
                          ? "bg-white text-slate-900 hover:bg-indigo-50"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      Full Resolution
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="min-h-screen bg-white pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 w-64 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-4 w-96 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
