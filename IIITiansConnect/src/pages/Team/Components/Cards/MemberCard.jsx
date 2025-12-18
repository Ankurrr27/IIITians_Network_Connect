import { Linkedin, Instagram } from "lucide-react";

export default function MemberCard({ member }) {
  return (
    <div className="group bg-white  rounded-xl p-3 text-center transition hover:shadow-lg">
      
      {/* IMAGE */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-3">
        <img
          src={member.photo?.url}
          alt={member.name}
          className="w-full h-full object-cover"
        />

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4
                        opacity-0 group-hover:opacity-100 transition">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-full hover:scale-110 transition"
            >
              <Linkedin size={18} className="text-indigo-600" />
            </a>
          )}

          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-full hover:scale-110 transition"
            >
              <Instagram size={18} className="text-pink-500" />
            </a>
          )}
        </div>
      </div>

      {/* TEXT */}
      <h4 className="text-sm font-semibold text-gray-900 leading-tight">
        {member.name}
      </h4>

      <p className="text-xs text-indigo-600 font-medium">
        {member.role}
      </p>

      <p className="text-[11px] text-gray-500">
        {member.iiit}
      </p>
    </div>
  );
}
