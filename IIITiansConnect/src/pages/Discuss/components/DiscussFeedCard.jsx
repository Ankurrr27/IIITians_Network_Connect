import { ExternalLink } from "lucide-react";
import { typeMeta } from "../discuss.constants";

export default function DiscussFeedCard({ post }) {
  const meta = typeMeta[post.type] || typeMeta.announcement;
  const Icon = meta.Icon;
  const gallery =
    Array.isArray(post.photos) && post.photos.length > 0
      ? post.photos
      : post.banner?.url
        ? [post.banner]
        : [];
  const previewImage = gallery[0]?.url || "";

  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-sky-100 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),rgba(242,248,255,0.96))] shadow-[0_18px_48px_-34px_rgba(37,99,235,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-34px_rgba(37,99,235,0.5)]">
      <div className="flex flex-col sm:flex-row">
        <div className="relative shrink-0 border-b border-sky-100 bg-sky-50 sm:w-60 sm:border-b-0 sm:border-r">
          {previewImage ? (
            <img src={previewImage} alt={post.title} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sky-700 ring-1 ring-sky-100">
                <Icon className="h-8 w-8" />
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              <Icon className="h-4 w-4" />
              {meta.label}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-sky-100">{post.collegeName}</span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-sky-100">{post.clubName}</span>
            {post.isAuthorisedPost && <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">{post.badgeLabel || "Verified by network"}</span>}
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{post.title}</h2>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{post.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
            {post.contactName && <span>{post.contactName}</span>}
            {post.contactPhone && <span>{post.contactPhone}</span>}
            {post.contactEmail && <span className="truncate">{post.contactEmail}</span>}
          </div>
          {post.actionLink && (
            <a href={post.actionLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700">
              Open link
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
