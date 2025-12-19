import { Linkedin, Instagram } from "lucide-react";

export default function MemberCard({ member }) {
  const firstName = member.name?.split(" ")[0];

  return (
    <div className="
      group bg-white rounded-xl
      p-1 sm:p-3
      text-center
      transition hover:shadow-lg
    ">
      {/* IMAGE */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-2 sm:mb-3">
        <img
          src={member.photo?.url}
          alt={member.name}
          className="w-full h-full object-cover"
        />

        {/* HOVER OVERLAY (desktop intent, fine) */}
        <div className="
          absolute inset-0 bg-black/60
          flex items-center justify-center gap-3 sm:gap-4
          opacity-0 group-hover:opacity-100 transition
        ">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="bg-white p-1.5 sm:p-2 rounded-full"
            >
              <Linkedin size={16} className="text-indigo-600 sm:size-[18px]" />
            </a>
          )}

          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer"
              className="bg-white p-1.5 sm:p-2 rounded-full"
            >
              <Instagram size={16} className="text-pink-500 sm:size-[18px]" />
            </a>
          )}
        </div>
      </div>

      {/* NAME */}
      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
        {/* Mobile → first name | Desktop → full name */}
        <span className="sm:hidden">{firstName}</span>
        <span className="hidden sm:inline">{member.name}</span>
      </h4>

      {/* ROLE — desktop only */}
      <p className="hidden sm:block text-xs text-indigo-600 font-medium">
        {member.role}
      </p>

      {/* COLLEGE */}
      <p className="text-[10px] sm:text-[11px] text-gray-500">
        {member.iiit}
      </p>
    </div>
  );
}
