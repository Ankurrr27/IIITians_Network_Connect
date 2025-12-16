import {
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";

const BigTeamCard = ({ name, role, college, image, desc, links = {} }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">

      {/* PHOTO + INFO */}
      <div className="flex items-start gap-4">
        {/* PHOTO */}
        <div className="w-40 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="pt-1">
          <h3 className="text-base font-semibold text-gray-900">
            {name}
          </h3>

          <p className="text-sm text-indigo-600 font-medium ">
            {role} | {college}
          </p>

          


          {/* ABOUT PARAGRAPH (THIS IS WHAT YOU WANTED) */}
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            {desc}
          </p>

          {/* SOCIAL HANDLES */}
          <div className="flex flex-wrap gap-3 mt-3 text-gray-600">
            {links.linkedin && (
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={16} />
              </a>
            )}
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer">
                <Github size={16} />
              </a>
            )}
            {links.instagram && (
              <a href={links.instagram} target="_blank" rel="noreferrer">
                <Instagram size={16} />
              </a>
            )}
            {links.twitter && (
              <a href={links.twitter} target="_blank" rel="noreferrer">
                <Twitter size={16} />
              </a>
            )}
            {links.website && (
              <a href={links.website} target="_blank" rel="noreferrer">
                <Globe size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BigTeamCard;
