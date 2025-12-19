import {
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";

const BigTeamCard = ({ name, role, college, image, desc, links = {} }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition">
      
      {/* MOBILE → COMPACT ROW | DESKTOP → RICH ROW */}
      <div className="flex items-start gap-2 sm:gap-4">
        
        {/* PHOTO */}
        <div
          className="
            w- h-14
            sm:w-40 sm:aspect-[3/4] sm:h-auto
            rounded-lg overflow-hidden
            flex-shrink-0
          "
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
            {name}
          </h3>

          <p className="text-xs sm:text-sm text-indigo-600 font-medium">
            {role} · {college}
          </p>

          {/* DESCRIPTION */}
          <p
            className="
              mt-1
              text-[11px] sm:text-sm
              text-gray-600
              leading-snug
              line-clamp-1 sm:line-clamp-none
            "
          >
            {desc}
          </p>

          {/* SOCIALS */}
          <div className="flex gap-2 sm:gap-3 mt-2 text-gray-600">
            {links.linkedin && (
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={14} />
              </a>
            )}
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer">
                <Github size={14} />
              </a>
            )}
            {links.instagram && (
              <a href={links.instagram} target="_blank" rel="noreferrer">
                <Instagram size={14} />
              </a>
            )}
            {links.twitter && (
              <a href={links.twitter} target="_blank" rel="noreferrer">
                <Twitter size={14} />
              </a>
            )}
            {links.website && (
              <a href={links.website} target="_blank" rel="noreferrer">
                <Globe size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigTeamCard;
