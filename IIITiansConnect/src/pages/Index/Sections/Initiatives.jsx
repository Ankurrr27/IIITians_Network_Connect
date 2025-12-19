import { Link } from "react-router-dom";
import { Newspaper, Trophy, Database, Award } from "lucide-react";

const projects = [
  {
    title: "Centralized Placement Data",
    description:
      "Transparent and structured placement statistics across all IIITs to help students make informed career decisions.",
    icon: <Database size={28} />,
    route: "/placement",
  },
  {
    title: "News & Events Across IIITs",
    description:
      "A unified feed of technical, cultural, and academic events happening across all IIIT campuses.",
    icon: <Newspaper size={28} />,
    route: "/events",
  },
  {
    title: "Competitions & Hackathons",
    description:
      "Discover, participate, and collaborate in hackathons and competitions conducted nationwide.",
    icon: <Trophy size={28} />,
    route: "/events",
  },
  {
    title: "Alumni Achievements",
    description:
      "Highlighting impactful career journeys, achievements, and contributions of IIIT alumni across domains.",
    icon: <Award size={28} />,
    route: "/alumni",
  },
];

export default function Initiatives() {
  return (
    <div>
      <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-12 text-left">
        Our Initiatives
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        {projects.map((project, index) => (
          <Link
            key={index}
            to={project.route}
            className="
              bg-gradient-to-br from-white to-indigo-50
              rounded-xl sm:rounded-2xl
              p-4 sm:p-8
              shadow-lg border border-indigo-100
              hover:shadow-xl transition-all duration-300
              transform hover:-translate-y-2
              flex sm:block
              gap-4
            "
          >
            {/* ICON */}
            <div
              className="
                text-indigo-600
                flex-shrink-0
                mt-1 sm:mt-0
              "
            >
              {/* smaller icon on mobile, original on desktop */}
              <span className="sm:hidden">
                {project.icon && project.icon.type
                  ? <project.icon.type size={20} />
                  : null}
              </span>
              <span className="hidden sm:block">{project.icon}</span>
            </div>

            {/* TEXT */}
            <div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">
                {project.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
