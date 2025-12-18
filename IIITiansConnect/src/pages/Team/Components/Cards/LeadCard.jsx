import { motion } from "framer-motion";
import { Linkedin, Instagram, Twitter } from "lucide-react";

export default function LeadCard({ member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group relative bg-white rounded-2xl p-5
                 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      {/* ACCENT STRIP */}
      <div className="absolute top-0 left-0 h-1 w-full rounded-l-2xl bg-indigo-500/90" />

      <div className="flex items-start gap-4">
        {/* IMAGE */}
        <div className="relative w-28 aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={member.photo?.url}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-300
                       group-hover:scale-[1.03]"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {member.name}
          </h3>

          <p className="text-sm text-indigo-600 font-medium mt-0.5">
            {member.role}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {member.iiit}
          </p>

          {/* SOCIALS */}
          <div className="flex gap-3 mt-4">
            {member.linkedin && (
              <Social href={member.linkedin}>
                <Linkedin size={14} />
              </Social>
            )}
            {member.instagram && (
              <Social href={member.instagram}>
                <Instagram size={14} />
              </Social>
            )}
            {member.twitter && (
              <Social href={member.twitter}>
                <Twitter size={14} />
              </Social>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- SOCIAL ---------------- */

function Social({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-full border border-gray-200 text-gray-600
                 hover:text-indigo-600 hover:border-indigo-600 transition"
    >
      {children}
    </a>
  );
}
