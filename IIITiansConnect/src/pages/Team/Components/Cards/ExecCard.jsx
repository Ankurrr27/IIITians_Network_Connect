import { motion } from "framer-motion";
import {
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";

export default function ExecCard({ member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="
        group relative bg-white rounded-2xl
        p-3 sm:p-5
        border border-gray-100
        hover:shadow-xl transition-shadow
      "
    >
      {/* TOP ACCENT */}
      <div className="absolute inset-x-0 top-0 h-0.5 sm:h-1 rounded-t-2xl bg-indigo-600/80" />

      <div className="flex items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
        {/* IMAGE */}
        <div
          className="
            relative
            w-24 sm:w-40
            aspect-[3/4]
            rounded-lg overflow-hidden
            flex-shrink-0
          "
        >
          <img
            src={member.photo?.url}
            alt={member.name}
            className="
              w-full h-full object-cover
              transition-transform duration-300
              group-hover:scale-[1.03]
            "
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:block">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 leading-tight">
                {member.name}
              </h3>

              <p className="text-[11px] sm:text-sm text-indigo-600 font-medium">
                {member.role}
                <span className="hidden sm:inline"> · {member.iiit}</span>
              </p>

              {/* College only on desktop */}
              <p className="hidden sm:block text-xs text-gray-500">
                {member.iiit}
              </p>
            </div>

            {/* SOCIALS — MOBILE */}
            <div className="flex gap-2 sm:hidden flex-shrink-0">
              {member.linkedin && (
                <Icon href={member.linkedin}>
                  <Linkedin size={14} />
                </Icon>
              )}
              {member.github && (
                <Icon href={member.github}>
                  <Github size={14} />
                </Icon>
              )}
              {member.instagram && (
                <Icon href={member.instagram}>
                  <Instagram size={14} />
                </Icon>
              )}
              {member.twitter && (
                <Icon href={member.twitter}>
                  <Twitter size={14} />
                </Icon>
              )}
              {member.website && (
                <Icon href={member.website}>
                  <Globe size={14} />
                </Icon>
              )}
            </div>
          </div>

          {/* SOCIALS — DESKTOP */}
          <div className="hidden sm:flex gap-3 mt-4">
            {member.linkedin && (
              <Social href={member.linkedin}>
                <Linkedin size={16} />
              </Social>
            )}
            {member.github && (
              <Social href={member.github}>
                <Github size={16} />
              </Social>
            )}
            {member.instagram && (
              <Social href={member.instagram}>
                <Instagram size={16} />
              </Social>
            )}
            {member.twitter && (
              <Social href={member.twitter}>
                <Twitter size={16} />
              </Social>
            )}
            {member.website && (
              <Social href={member.website}>
                <Globe size={16} />
              </Social>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Social({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        p-2 rounded-full
        border border-gray-200
        text-gray-600
        hover:text-indigo-600
        hover:border-indigo-600
        transition
      "
    >
      {children}
    </a>
  );
}

function Icon({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        p-1.5 rounded-full
        border border-gray-200
        text-gray-600
        hover:text-indigo-600
      "
    >
      {children}
    </a>
  );
}
