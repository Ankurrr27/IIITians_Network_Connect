import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";

const COLLEGE_PLACEHOLDER = "/placeholder.svg";

const CollegeCard = ({ college, teamCount = 0, discussClubs = [] }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Initialize state with props directly to avoid destructuring sync issues
  const [galleryImages, setGalleryImages] = useState(college.gallery || []);

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

  const handleGalleryUpload = async (event, caption = "") => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    if (caption) formData.append("caption", caption);

    try {
      const response = await api.patch(`/colleges/${id}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data?.gallery) {
        setGalleryImages(response.data.gallery);
      }
    } catch (err) {
      console.error("GALLERY UPLOAD ERROR:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
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

  const visibleClubLinks = clubLinks.filter((item) => item?.name && item?.url);
  const displayClubLinks =
    visibleClubLinks.length > 0
      ? visibleClubLinks
        : clubLink
        ? [{ name: "Club / Community", url: clubLink }]
        : [];
  const mergedClubs = [
    ...displayClubLinks.map((item, index) => ({
      id: `college-${item.name}-${index}`,
      name: item.name,
      url: item.url,
      source: "college",
      isAuthorized: false,
      badgeLabel: "",
    })),
    ...discussClubs.map((club, index) => ({
      id: club.id || `discuss-${club.clubName}-${index}`,
      name: club.clubName,
      url: club.website || "",
      source: "discuss",
      isAuthorized: Boolean(club.isAuthorized),
      badgeLabel: club.badgeLabel || "Verified by network",
    })),
  ];

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

        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md shadow-lg ring-1 ring-white/10 transition-transform group-hover:scale-105">
          <Users className="h-3.5 w-3.5" />
          {teamCount} Team
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
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
            {name}
          </h3>
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
                <Link
                  to={`/discuss?mode=register&college=${encodeURIComponent(name)}`}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                  onClick={() => setShowMenu(false)}
                >
                  <Users className="h-4 w-4" />
                  Register your club
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => {
                    setShowMenu(false);
                    setShowGallery(true);
                  }}
                >
                  <Images className="h-4 w-4" />
                  View Gallery
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  onClick={() => {
                    setShowMenu(false);
                    setShowGallery(true);
                  }}
                >
                  <ImagePlus className="h-4 w-4" />
                  Add College Photos
                </button>
                <div className="my-1 h-px bg-slate-100" />
                <Link
                  to="/guide?flow=discuss"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  onClick={() => setShowMenu(false)}
                >
                  How it works
                </Link>
              </div>
            )}
          </div>
        </div>

        {description && (
          <div className="mb-3">
            <p
              className={`text-sm text-gray-600 ${
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
            className="mb-3 w-fit text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            {showFullDescription ? "See less" : "See more"}
          </button>
        )}

          {showFullDescription && mergedClubs.length > 0 && (
          <div className="mb-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Clubs & Societies
              </div>
              <div className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                {mergedClubs.length} Active
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {mergedClubs.map((club) =>
                club.url ? (
                  <a
                    key={club.id}
                    href={club.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition ${
                      club.source === "discuss"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {club.name}
                    <Link2 size={14} />
                  </a>
                ) : (
                  <span
                    key={club.id}
                    title="No link provided"
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm cursor-help ${
                      club.source === "discuss"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : "bg-white text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {club.name}
                    {club.isAuthorized && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        <ShieldCheck size={12} />
                        {club.badgeLabel}
                      </span>
                    )}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100">
          {teamCount > 0 && (
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
              <Users size={14} className="text-indigo-500" />
              {teamCount} Network Members
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Link
              to={`/team?iiit=${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-1 whitespace-nowrap leading-none rounded-full bg-indigo-600 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-indigo-700 sm:px-3.5 sm:py-2 sm:text-[11px]"
            >
              View Team
            </Link>
            <Link
              to={`/legacy?iiit=${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-1 whitespace-nowrap leading-none rounded-full bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-emerald-700 sm:px-3.5 sm:py-2 sm:text-[11px]"
            >
              View Legacy
            </Link>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 whitespace-nowrap leading-none rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 sm:px-3.5 sm:py-2 sm:text-[11px]"
              >
                Website <ExternalLink size={10} className="sm:size-3" />
              </a>
            )}
          </div>
        </div>

        {showGallery &&
          createPortal(
            <GalleryModal
              name={name}
              images={galleryImages}
              onClose={() => setShowGallery(false)}
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
  const [userCaption, setUserCaption] = useState("");

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 p-4 backdrop-blur-xl sm:p-6 lg:p-8">
      {/* Compact Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition-all hover:bg-slate-200 hover:rotate-90"
      >
        <X size={20} />
      </button>

      <div className="relative flex h-full w-full max-w-5xl flex-col gap-4 overflow-hidden sm:gap-6">
        {/* Normalized Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {name} <span className="text-indigo-600">Gallery</span>
            </h2>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
               {images.length} Moments Shared
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Context (e.g. Garden)"
              value={userCaption}
              onChange={(e) => setUserCaption(e.target.value)}
              className="hidden h-10 w-48 rounded-xl border border-slate-200 bg-slate-100/50 px-4 text-[13px] font-medium transition-all focus:bg-white focus:ring-2 focus:ring-indigo-600/20 lg:block"
            />
            <label className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-[13px] font-bold text-white transition-all hover:bg-slate-800 active:scale-95">
              <Plus size={16} />
              {uploading ? "Uploading..." : "Add Photo"}
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  onUpload(e, userCaption);
                  setUserCaption("");
                }} 
                disabled={uploading} 
              />
            </label>
          </div>
        </div>

        {/* Cinematic Preview Stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50/20 ring-1 ring-slate-100 sm:rounded-3xl">
          {images.length > 0 ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={images[activeIndex].url}
                  alt={`${name} gallery`}
                  className="h-full w-full object-contain animate-in fade-in zoom-in-95 duration-500"
                />

                {/* Elegant Caption Overlay */}
                {images[activeIndex].caption && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-fit max-w-[85%] rounded-xl bg-white/90 px-5 py-2.5 text-center text-[13px] font-bold text-slate-800 shadow-xl backdrop-blur-md ring-1 ring-slate-200 animate-in slide-in-from-bottom-2 duration-700">
                    {images[activeIndex].caption}
                  </div>
                )}

                {/* Compact Admin Delete */}
                {isAdmin && (
                  <button
                    onClick={() => onDelete(images[activeIndex].url)}
                    className="absolute left-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white/40 text-rose-600 backdrop-blur-md transition-all hover:bg-rose-600 hover:text-white shadow-lg ring-1 ring-white/20"
                    title="Remove Photo"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-md transition-all hover:bg-white sm:left-5"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-md transition-all hover:bg-white sm:right-5"
                  >
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

        {/* Thumbnail Track */}
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-1 pb-2 custom-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 transition-all ${
                  idx === activeIndex
                    ? "ring-2 ring-indigo-600 ring-offset-2 scale-105"
                    : "opacity-40 hover:opacity-100 shadow-sm"
                }`}
              >
                <img src={img.url} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeCard;
