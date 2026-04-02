import { Instagram, Linkedin } from "lucide-react";

export default function MemberCard({ member }) {
  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(79,70,229,0.10)]">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={member.photo?.url}
          alt={member.name}
          className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-2.5">
          <span className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-white/90">
            {member.role}
          </span>

          <div className="flex gap-1.5">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-indigo-600 transition hover:bg-white"
              >
                <Linkedin size={13} />
              </a>
            )}

            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-pink-500 transition hover:bg-white"
              >
                <Instagram size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 pt-3 text-center sm:px-3.5 sm:pb-3.5">
        <h4 className="line-clamp-2 text-xs font-semibold leading-tight text-slate-900 sm:text-sm">
          {member.name}
        </h4>
        <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-[11px]">
          {member.iiit}
        </p>
      </div>
    </article>
  );
}
