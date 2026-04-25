import { ExternalLink } from "lucide-react";
import { typeMeta } from "../discuss.constants";

export default function DiscussFeedCard({ post }) {
  const meta = typeMeta[post.type] || typeMeta.announcement;
  const Icon = meta.Icon;
  const normalizedCollege = (post.collegeName || "").trim().toLowerCase();
  const normalizedClub = (post.clubName || "").trim().toLowerCase();
  const showClubChip =
    post.clubName && normalizedClub && normalizedClub !== normalizedCollege;
  const gallery =
    Array.isArray(post.photos) && post.photos.length > 0
      ? post.photos
      : post.banner?.url
        ? [post.banner]
        : [];
  const previewImage = gallery[0]?.url || "";

  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),rgba(248,250,252,0.96))] shadow-[0_18px_48px_-34px_rgba(99,102,241,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-34px_rgba(99,102,241,0.25)]">
      <div className="flex flex-col sm:flex-row">
        <div className="relative shrink-0 border-b border-slate-200 bg-slate-50 sm:w-60 sm:border-b-0 sm:border-r">
          {previewImage ? (
            <img src={previewImage} alt={post.title} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-700 ring-1 ring-slate-200">
                <Icon className="h-8 w-8" />
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">
              <Icon className="h-4 w-4" />
              {meta.label}
            </span>
            {post.collegeName && (
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">{post.collegeName}</span>
            )}
            {showClubChip && (
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">{post.clubName}</span>
            )}
            {post.isAuthorisedPost && <span className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm">{post.badgeLabel || "Verified by network"}</span>}
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{post.title}</h2>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{post.description}</p>
          {post.actionLink && (
            <a href={post.actionLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Open link
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
