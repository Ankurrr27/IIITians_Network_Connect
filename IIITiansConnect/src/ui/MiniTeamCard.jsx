import { Linkedin, Instagram } from "lucide-react";

const MiniTeamCard = ({
  name,
  team,
  college,
  image,
  instagram,
  linkedin,
}) => {
  return (
    <div
      className="
        group flex-shrink-0 w-[200px]
        bg-white rounded-2xl
        border border-gray-200
        p-3
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="
            w-full h-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />

        {/* TEAM BADGE */}
        <span
          className="
            absolute bottom-2 left-2
            bg-white/90 backdrop-blur
            text-[10px] font-semibold text-indigo-600
            px-2 py-[3px] rounded-full
            shadow
          "
        >
          {team}
        </span>
      </div>

      {/* TEXT */}
      <div className="mt-3 px-1 space-y-1">
        <h4 className="text-[14px] font-semibold text-gray-900 truncate">
          {name}
        </h4>

        {/* COLLEGE + HANDLES INLINE */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500 truncate">
          <span className="truncate">{college}</span>

          <div className="flex items-center gap-1 ml-auto">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition"
              >
                <Instagram size={14} />
              </a>
            )}

            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition"
              >
                <Linkedin size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniTeamCard;
