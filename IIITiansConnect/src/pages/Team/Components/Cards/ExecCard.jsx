import { motion } from "framer-motion";
import { Github, Globe, Instagram, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { key: "linkedin", Icon: Linkedin },
  { key: "github", Icon: Github },
  { key: "instagram", Icon: Instagram },
  { key: "twitter", Icon: Twitter },
  { key: "website", Icon: Globe },
];

export default function ExecCard({ member }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_26px_65px_rgba(79,70,229,0.14)]"
    >
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400" />

      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div className="relative h-56 overflow-hidden bg-slate-100 md:h-full">
          <img
            src={member.photo?.url}
            alt={member.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/45 to-transparent md:hidden" />
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:text-xs">
              Executive Team
            </span>
            {member.year && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
                {member.year}
              </span>
            )}
          </div>

          <div className="mt-3">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {member.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-indigo-600 sm:text-base">
              {member.role}
            </p>
            <p className="mt-1 text-sm text-slate-500">{member.iiit}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {socialLinks.map(({ key, Icon }) =>
              member[key] ? (
                <a
                  key={key}
                  href={member[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Icon size={16} />
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
