import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { key: "linkedin", Icon: Linkedin },
  { key: "instagram", Icon: Instagram },
  { key: "twitter", Icon: Twitter },
];

export default function LeadCard({ member }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_26px_62px_rgba(79,70,229,0.12)]"
    >
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-sky-400" />

      <div className="flex flex-col">
        <div className="relative h-56 w-full overflow-hidden bg-slate-100 sm:h-64">
          <img
            src={member.photo?.url}
            alt={member.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />
          <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="line-clamp-2 text-lg font-semibold leading-tight text-white sm:text-xl">
                {member.name}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 sm:text-sm">
                {member.role}
              </p>
            </div>

            <div className="flex flex-shrink-0 gap-2">
              {socialLinks.map(({ key, Icon }) =>
                member[key] ? (
                  <a
                    key={key}
                    href={member[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 transition hover:bg-white hover:text-indigo-700"
                  >
                    <Icon size={15} />
                  </a>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Institute
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700 sm:text-base">
              {member.iiit}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
