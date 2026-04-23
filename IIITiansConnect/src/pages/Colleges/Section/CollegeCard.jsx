import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ExternalLink,
  MoreHorizontal,
  Link2,
  ShieldCheck,
  Users,
  Images,
  ImagePlus,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  Trash2,
  Building2,
  Globe,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../../api/axios";

const COLLEGE_PLACEHOLDER = "/placeholder.svg";

const CollegeCard = ({ college, teamCount = 0, discussClubs = [] }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const sortGallery = (imgs) => {
    const getTime = (img) => {
      if (img.createdAt) return new Date(img.createdAt).getTime();
      if (img._id && typeof img._id === "string" && img._id.length >= 8)
        return parseInt(img._id.substring(0, 8), 16) * 1000;
      return 0;
    };
    return [...imgs].sort((a, b) => getTime(b) - getTime(a));
  };

  const [galleryImages, setGalleryImages] = useState(
    sortGallery(college.gallery || [])
  );

  const {
    _id: id,
    name,
    photo,
    logo,
    description,
    website,
    clubLink,
    clubLinks = [],
  } = college;

  const isAdmin = Boolean(localStorage.getItem("adminToken"));

  useEffect(() => {
    const galleryId = searchParams.get("gallery");
    if (galleryId === id && !showGallery) {
      setShowGallery(true);
    }
  }, [searchParams, id]);

  const toggleGallery = (open) => {
    setShowGallery(open);
    if (open) {
      searchParams.set("gallery", id);
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.delete("gallery");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleGalleryUpload = async (stagedItems) => {
    if (!stagedItems || stagedItems.length === 0) return;

    const { notifyAppAction } = await import("../../../utils/appNotifications");
    
    setUploading(true);
    const formData = new FormData();
    
    stagedItems.forEach((item) => {
      formData.append("images", item.file);
      formData.append("captions", item.caption || "");
    });

    try {
      const response = await api.patch(`/colleges/${id}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data?.gallery) {
        setGalleryImages(sortGallery(response.data.gallery));
        notifyAppAction({
          title: "Gallery Updated",
          message: `Successfully uploaded ${stagedItems.length} photos to ${name}.`,
          type: "milestone"
        });
        return true;
      }
    } catch (err) {
      console.error("GALLERY UPLOAD ERROR:", err);
      notifyAppAction({
        title: "Upload Failed",
        message: err.response?.data?.message || "Failed to upload gallery photos.",
        type: "error"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this photo from the gallery?")) return;

    try {
      await api.delete(`/colleges/${id}/gallery`, { data: { imageUrl } });
      setGalleryImages((prev) => prev.filter((img) => img.url !== imageUrl));
    } catch (err) {
      console.error("GALLERY DELETE ERROR:", err);
    }
  };

  const coverImage = photo?.url || (galleryImages && galleryImages[0]?.url) || logo?.url || COLLEGE_PLACEHOLDER;
  const logoImage = logo?.url || COLLEGE_PLACEHOLDER;
  const [coverSrc, setCoverSrc] = useState(coverImage);
  const [logoSrc, setLogoSrc] = useState(logoImage);

  useEffect(() => {
    setCoverSrc(coverImage);
  }, [coverImage]);

  useEffect(() => {
    setLogoSrc(logoImage);
  }, [logoImage]);

  const formatExternalLink = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const visibleClubLinks = clubLinks.filter((item) => item?.name && item?.url);
  const displayClubLinks =
    visibleClubLinks.length > 0
      ? visibleClubLinks
        : clubLink
        ? [{ name: "Club / Community", url: clubLink }]
        : [];

  const mergedClubs = useMemo(() => {
    const clubsMap = new Map();

    displayClubLinks.forEach((item, index) => {
      const nameKey = item.name.trim().toLowerCase();
      if (!clubsMap.has(nameKey)) {
        clubsMap.set(nameKey, {
          id: `college-${item.name}-${index}`,
          name: item.name,
          url: formatExternalLink(item.url),
          source: "college",
          isAuthorized: false,
          badgeLabel: "",
        });
      }
    });

    discussClubs.forEach((club, index) => {
      const nameKey = club.clubName.trim().toLowerCase();
      if (!clubsMap.has(nameKey) || !clubsMap.get(nameKey).isAuthorized) {
        clubsMap.set(nameKey, {
          id: club.id || `discuss-${club.clubName}-${index}`,
          name: club.clubName,
          url: formatExternalLink(club.website),
          source: "discuss",
          isAuthorized: Boolean(club.isAuthorized),
          badgeLabel: club.badgeLabel || "Verified by network",
        });
      }
    });

    return Array.from(clubsMap.values());
  }, [displayClubLinks, discussClubs]);

  const hasExpandableDetails =
    (description && description.length > 140) ||
    mergedClubs.length > 0;

  return (
    <div
      className="
        group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl
      "
    >
      <div className="relative aspect-[16/8.2] overflow-hidden bg-slate-100">
        <img
          src={coverSrc}
          alt={`${name} college`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]"
          onError={() => {
            if (coverSrc !== logoImage && logo?.url) {
              setCoverSrc(logoImage);
              return;
            }
            setCoverSrc(COLLEGE_PLACEHOLDER);
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_60%),_linear-gradient(to_top,_rgba(0,0,0,0.2)_0%,_transparent_50%)]" />

        <div className="absolute right-3 top-3 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2">
          <Link
            to={`/college/${encodeURIComponent(name)}/gallery`}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/40 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-md shadow-lg transition-all hover:bg-slate-900/60 hover:scale-110 active:scale-95 sm:px-3 sm:text-[11px]"
            title="View Gallery"
          >
            <Images className="h-3.5 w-3.5" />
            {galleryImages.length}
          </Link>

          <Link
            to={`/college/${encodeURIComponent(name)}/clubs`}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-emerald-900/40 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-md shadow-lg transition-all hover:bg-emerald-900/70 hover:scale-110 active:scale-95 sm:px-3 sm:text-[11px]" 
            title="Registered Clubs"
          >
            <Link2 className="h-3.5 w-3.5" />
            {mergedClubs.length}
          </Link>

          <Link
            to={`/team?iiit=${encodeURIComponent(name)}`}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-indigo-900/40 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-md shadow-lg transition-all hover:bg-indigo-900/60 hover:scale-110 active:scale-95 sm:px-3 sm:text-[11px]" 
            title="Community Team"
          >
            <Users className="h-3.5 w-3.5" />
            {teamCount}
          </Link>
        </div>
      </div>

      <div
        className="
          relative -mt-4 flex flex-1 flex-col rounded-t-[1.6rem] bg-white p-4 transition-all duration-300 ease-out
          group-hover:-translate-y-1 sm:p-6 sm:rounded-t-[2rem]
        "
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-200 transition-transform group-hover:-translate-y-1 group-hover:rotate-3">
            <img
              src={logoSrc}
              alt={`${name} logo`}
              className="h-9 w-9 object-contain"
              onError={() => setLogoSrc(COLLEGE_PLACEHOLDER)}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 sm:text-lg">
              {name}
            </h3>
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noreferrer"
                className="group/link flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 sm:text-[11px]"
              >
                <Globe size={12} className="shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                <ExternalLink size={10} className="opacity-0 transition-opacity group-hover/link:opacity-100" />
              </a>
            )}
          </div>
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label={`More options for ${name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-11 z-20 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => {
                    setShowMenu(false);
                    window.location.href = `/college/${encodeURIComponent(name)}/gallery`;
                  }}
                >
                  <Images className="h-4 w-4 text-indigo-600" />
                  View Gallery
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => {
                    setShowMenu(false);
                    window.location.href = `/college/${encodeURIComponent(name)}/clubs`;
                  }}
                >
                  <Link2 className="h-4 w-4 text-emerald-600" />
                  Explore Clubs
                </button>
                <div className="my-1 h-px bg-slate-100" />
                <Link
                  to={`/discuss?mode=register&college=${encodeURIComponent(name)}`}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                  onClick={() => setShowMenu(false)}
                >
                  <Users className="h-4 w-4" />
                  Register club
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                  onClick={() => {
                    setShowMenu(false);
                    toggleGallery(true);
                  }}
                >
                  <ImagePlus className="h-4 w-4" />
                  Add Photos
                </button>
                <div className="my-1 h-px bg-slate-100" />
                <Link
                  to="/guide?flow=discuss"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  onClick={() => setShowMenu(false)}
                >
                  <ShieldCheck size={16} />
                  How it works
                </Link>
              </div>
            )}
          </div>
        </div>

        {description && (
          <div className="mb-3">
            <p
              className={`text-sm font-medium text-gray-600 ${
                showFullDescription ? "" : "line-clamp-4"
              }`}
            >
              {description}
            </p>
          </div>
        )}

        {hasExpandableDetails && (
          <button
            type="button"
            onClick={() => setShowFullDescription((prev) => !prev)}
            className="mb-3 w-fit text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
          >
            {showFullDescription ? "See less" : "See more"}
          </button>
        )}

          {showFullDescription && mergedClubs.length > 0 && (
          <div className="mb-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Community Societies
              </div>
              <Link to={`/college/${encodeURIComponent(name)}/clubs`} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-tight">
                View All
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {mergedClubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/college/${encodeURIComponent(name)}/clubs/${encodeURIComponent(club.name)}`}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                      club.source === "discuss"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100 shadow-emerald-700/5"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {club.name}
                    {club.isAuthorized && <ShieldCheck size={12} className="text-emerald-500" />}
                    <ChevronRight size={12} className="opacity-40" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Link
               to={`/college/${encodeURIComponent(name)}/gallery`}
               className="inline-flex items-center gap-1.5 whitespace-nowrap leading-none rounded-full bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 sm:text-[11px]"
            >
              <Images size={14} />
              Gallery
            </Link>
            <Link
               to={`/college/${encodeURIComponent(name)}/clubs`}
               className="inline-flex items-center gap-1.5 whitespace-nowrap leading-none rounded-full bg-indigo-600 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-indigo-700 sm:text-[11px]"
            >
              <Users size={14} />
              Clubs
            </Link>
             <Link
              to={`/legacy?iiit=${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap leading-none rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 sm:text-[11px]"
            >
              Legacy
            </Link>
          </div>
        </div>

        {showGallery &&
          createPortal(
            <GalleryModal
              name={name}
              images={galleryImages}
              onClose={() => toggleGallery(false)}
              onUpload={handleGalleryUpload}
              uploading={uploading}
              isAdmin={isAdmin}
              onDelete={handleDeleteImage}
            />,
            document.body
          )}
      </div>
    </div>
  );
};

function GalleryModal({ name, images = [], onClose, onUpload, uploading, isAdmin, onDelete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stagedItems, setStagedItems] = useState([]);
  const [viewMode, setViewMode] = useState("BROWSE");

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newStaged = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      caption: ""
    }));

    setStagedItems(prev => [...prev, ...newStaged]);
    setViewMode("STAGING");
  };

  const updateStagedCaption = (idx, text) => {
    setStagedItems(prev => prev.map((item, i) => i === idx ? { ...item, caption: text } : item));
  };

  const removeStagedItem = (idx) => {
    setStagedItems(prev => {
      const filtered = prev.filter((_, i) => i !== idx);
      if (filtered.length === 0) setViewMode("BROWSE");
      return filtered;
    });
  };

  const handleCommitUpload = async () => {
    const success = await onUpload(stagedItems);
    if (success) {
      setStagedItems([]);
      setViewMode("BROWSE");
    }
  };

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 p-4 backdrop-blur-xl sm:p-6 lg:p-8">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition-all hover:bg-slate-200 hover:rotate-90"
      >
        <X size={20} />
      </button>

      <div className="relative flex h-full w-full max-w-5xl flex-col gap-4 overflow-hidden sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {name} <span className="text-indigo-600">Gallery</span>
            </h2>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {images.length} Moments
              </p>
              {viewMode === "STAGING" && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 animate-pulse">
                   {stagedItems.length} New captures
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === "STAGING" ? (
              <>
                <button
                  onClick={() => {
                    setStagedItems([]);
                    setViewMode("BROWSE");
                  }}
                  className="h-10 rounded-xl px-4 text-[13px] font-bold text-slate-500 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitUpload}
                  disabled={uploading}
                  className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-[13px] font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploading ? "Uploading..." : `Upload ${stagedItems.length}`}
                </button>
              </>
            ) : (
              <label className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-[13px] font-bold text-white transition-all hover:bg-slate-800 active:scale-95">
                <Plus size={16} />
                Add Photos
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileSelection}
                  disabled={uploading} 
                />
              </label>
            )}
          </div>
        </div>

        {viewMode === "STAGING" ? (
          <div className="flex-1 overflow-y-auto rounded-3xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200 scrollbar-hide">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stagedItems.map((item, idx) => (
                <div key={idx} className="group relative space-y-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
                   <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                      <img src={item.preview} alt="preview" className="h-full w-full object-cover" />
                      <button 
                        onClick={() => removeStagedItem(idx)}
                        className="absolute right-2 top-2 rounded-lg bg-black/40 p-1.5 text-white backdrop-blur-md transition hover:bg-rose-600"
                      >
                        <X size={14} />
                      </button>
                   </div>
                   <input 
                     type="text" 
                     placeholder="Add a context / caption..."
                     value={item.caption}
                     onChange={(e) => updateStagedCaption(idx, e.target.value)}
                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-bold outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-600/10"
                   />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50/20 ring-1 ring-slate-100 sm:rounded-3xl">
            {images.length > 0 ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={images[activeIndex].url}
                    alt={`${name} gallery`}
                    className="h-full w-full object-contain animate-in fade-in zoom-in-95 duration-500"
                  />
                  {images[activeIndex].caption && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-fit max-w-[85%] rounded-xl bg-white/90 px-5 py-2.5 text-center text-[13px] font-bold text-slate-800 shadow-xl backdrop-blur-md ring-1 ring-slate-200 animate-in slide-in-from-bottom-2 duration-700">
                      {images[activeIndex].caption}
                    </div>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(images[activeIndex].url)}
                      className="absolute left-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white/40 text-rose-600 backdrop-blur-md transition-all hover:bg-rose-600 shadow-lg ring-1 ring-white/20"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={prev} className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-md transition-all hover:bg-white sm:left-5">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={next} className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-md transition-all hover:bg-white sm:right-5">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-300">
                <Images size={48} />
                <p className="text-sm font-bold uppercase tracking-widest">No captures yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeCard;
