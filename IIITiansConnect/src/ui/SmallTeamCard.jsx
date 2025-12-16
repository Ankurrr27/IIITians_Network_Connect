import {
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";

const SmallTeamCard = ({ name, role, college, image, desc, links = {} }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">

      {/* ROW LAYOUT */}
      <div className="flex items-start gap-4">

        {/* IMAGE — UNCHANGED */}
        <div className="w-40 aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full object-contain"
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="flex-1 pt-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {name}
          </h4>

          <p className="text-xs text-indigo-600 font-medium mb-1">
            {role} | {college}
          </p>

          
          {/* DESCRIPTION (NEW) */}
          {desc && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {desc}
            </p>
          )}

          {/* SOCIAL ICONS */}
          <div className="flex flex-wrap gap-3 mt-2 text-gray-600">
            {links.linkedin && <a href={links.linkedin}><Linkedin size={14} /></a>}
            {links.github && <a href={links.github}><Github size={14} /></a>}
            {links.instagram && <a href={links.instagram}><Instagram size={14} /></a>}
            {links.twitter && <a href={links.twitter}><Twitter size={14} /></a>}
            {links.website && <a href={links.website}><Globe size={14} /></a>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmallTeamCard;
