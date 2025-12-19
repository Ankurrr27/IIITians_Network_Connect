import { motion } from "framer-motion";
import { Linkedin, Instagram, Twitter } from "lucide-react";

export default function LeadCard({ member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="
        group relative bg-white rounded-2xl
        p-3 md:p-4
        border border-gray-100
        hover:shadow-lg transition-shadow
      "
    >
      {/* ACCENT STRIP */}
      <div className="absolute top-0 left-0 h-0.5 sm:h-1  w-full rounded-l-2xl bg-indigo-500/90" />

      <div className="flex items-center gap-3 md:gap-5">
        {/* IMAGE */}
        <div
          className="
            relative
            w-20 md:w-32
            aspect-[3/4]
            rounded-lg md:rounded-xl
            overflow-hidden
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
          <div className="flex items-start justify-between gap-2 md:block">
            <div>
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 leading-tight">
                {member.name}
              </h3>

              <p className="text-[11px] md:text-sm text-indigo-600 font-medium">
                {member.role}
              </p>

              {/* College only on laptop */}
              <p className="hidden md:block text-sm text-gray-500 mt-1">
                {member.iiit}
              </p>
            </div>

            {/* SOCIALS — mobile */}
            <div className="flex gap-2 md:hidden flex-shrink-0">
              {member.linkedin && (
                <Icon href={member.linkedin}>
                  <Linkedin size={14} />
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
            </div>
          </div>

          {/* SOCIALS — laptop */}
          <div className="hidden md:flex gap-3 mt-5">
            {member.linkedin && (
              <Social href={member.linkedin}>
                <Linkedin size={16} />
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- SOCIALS ---------------- */

function Social({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        p-2.5 rounded-full
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
