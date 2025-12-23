import { Linkedin, Github, Instagram, Twitter, Globe } from "lucide-react";
import { useState } from "react";

const BigTeamCard = ({ name, role, college, image, desc, links = {} }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition">
      
      {/* TOP ROW */}
      <div className="flex items-start gap-3 sm:gap-4">
        
        {/* PHOTO */}
        <div
          className="
            w-14 h-14
            sm:w-40 sm:aspect-[3/4] sm:h-auto
            rounded-lg overflow-hidden
            flex-shrink-0
            sm:-ml-4 sm:-mt-4 sm:-mb-4
          "
        >
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
            {name}
          </h3>

          <p className="text-xs sm:text-sm text-indigo-600 font-medium">
            {role} · {college}
          </p>

          {/* DESCRIPTION — DESKTOP */}
          <p
            className={`
              hidden sm:block
              mt-1
              text-sm
              text-gray-600
              leading-snug
              overflow-hidden
              transition-all duration-300
              ${expanded ? "max-h-[500px]" : "max-h-[4.5em]"}
            `}
          >
            {desc}
          </p>

          {/* SEE MORE — DESKTOP */}
          {desc?.length > 80 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="hidden sm:inline-block text-xs text-indigo-500 mt-1 hover:underline"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}

          {/* SOCIALS — DESKTOP (below description) */}
          <div className="hidden sm:flex gap-3 mt-3 text-gray-600">
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
            {links.github && <a href={links.github} target="_blank" rel="noreferrer"><Github size={16} /></a>}
            {links.instagram && <a href={links.instagram} target="_blank" rel="noreferrer"><Instagram size={16} /></a>}
            {links.twitter && <a href={links.twitter} target="_blank" rel="noreferrer"><Twitter size={16} /></a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer"><Globe size={16} /></a>}
          </div>
        </div>
      </div>

      {/* DESCRIPTION — MOBILE FULL WIDTH */}
      <div className="sm:hidden mt-2">
        <p
          className={`
            text-[11px]
            text-gray-600
            leading-snug
            overflow-hidden
            transition-all duration-300
            ${expanded ? "max-h-[500px]" : "max-h-[6em]"}
          `}
        >
          {desc}
        </p>

        {desc?.length > 80 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] text-indigo-500 mt-1 hover:underline"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}

        {/* SOCIALS — MOBILE */}
        <div className="flex gap-2 mt-3 text-gray-600">
          {links.linkedin && <a href={links.linkedin}><Linkedin size={14} /></a>}
          {links.github && <a href={links.github}><Github size={14} /></a>}
          {links.instagram && <a href={links.instagram}><Instagram size={14} /></a>}
          {links.twitter && <a href={links.twitter}><Twitter size={14} /></a>}
          {links.website && <a href={links.website}><Globe size={14} /></a>}
        </div>
      </div>
    </div>
  );
};

export default BigTeamCard;
