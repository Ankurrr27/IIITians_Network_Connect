import { Linkedin, Github, Instagram, Twitter, Globe } from "lucide-react";
import { useState } from "react";

const socialItems = [
  { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
  { key: "github", icon: Github, label: "GitHub" },
  { key: "instagram", icon: Instagram, label: "Instagram" },
  { key: "twitter", icon: Twitter, label: "Twitter" },
  { key: "website", icon: Globe, label: "Website" },
];

const BigTeamCard = ({ name, role, college, image, desc, links = {} }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white  shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(79,70,229,0.12)] sm:rounded-[1.75rem] sm:p-5">
      <div className="flex items-start gap-3 sm:block">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-[1rem] bg-indigo-50 sm:h-64 sm:w-full ">
          <img src={image} alt={name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/20 to-transparent sm:h-24" />
        </div>

        <div className="min-w-0 flex-1 sm:mt-5">
          <h3 className="text-sm font-semibold leading-tight text-slate-900 sm:text-2xl">
            {name}
          </h3>

          <p className="mt-1 text-[11px] font-medium leading-4 text-indigo-600 sm:text-sm sm:leading-5">
            {role} · {college}
          </p>

          <p
            className={`mt-2 text-[12px] leading-5 text-slate-600 sm:mt-3 sm:text-[15px] sm:leading-7 ${
              expanded ? "" : "line-clamp-3 sm:line-clamp-5"
            }`}
          >
            {desc}
          </p>

          {desc?.length > 80 && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-1.5 text-xs font-medium text-indigo-600 transition hover:text-indigo-700 sm:mt-2 sm:text-sm"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 sm:mt-5">
        {socialItems.map(({ key, icon: Icon, label }) =>
          links[key] ? (
            <a
              key={key}
              href={links[key]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
            >
              <Icon size={14} />
              <span>{label}</span>
            </a>
          ) : null
        )}
      </div>
    </div>
  );
};

export default BigTeamCard;
