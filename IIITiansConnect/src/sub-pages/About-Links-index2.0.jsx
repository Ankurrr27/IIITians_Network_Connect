import React from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Trophy,
  Database,
  Award,
  Instagram,
  Linkedin,
  Github,
  Twitter,
  Globe,
} from "lucide-react";

/* ================== DATA ================== */
const projects = [
  {
    title: "Centralized Placement Data",
    description:
      "Transparent and structured placement statistics across all IIITs to help students make informed career decisions.",
    icon: <Database size={28} />,
    route: "/placements",
  },
  {
    title: "News & Events Across IIITs",
    description:
      "A unified feed of technical, cultural, and academic events happening across all IIIT campuses.",
    icon: <Newspaper size={28} />,
    route: "/news-events",
  },
  {
    title: "Competitions & Hackathons",
    description:
      "Discover, participate, and collaborate in hackathons and competitions conducted nationwide.",
    icon: <Trophy size={28} />,
    route: "/competitions-hackathons",
  },
  {
    title: "Alumni Achievements",
    description:
      "Highlighting impactful career journeys, achievements, and contributions of IIIT alumni across domains.",
    icon: <Award size={28} />,
    route: "/alumni-achievements",
  },
];

/* ================== COMPONENT ================== */
export default function Index2() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        {/* LEFT — ABOUT US */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
            About Us
          </h2>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-10 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed">
              IIITians Network is an autonomous, student-driven community that
              connects students and alumni across all Indian Institutes of
              Information Technology.
              <br />
              <br />
              Founded in January 2020 by students from IIIT Kota, IIIT Guwahati,
              and IIIT Gwalior, the initiative was built to solve a real
              problem: the lack of a unified, transparent, and student-first
              platform for IIITs.
              <br />
              <br />
              Over the years, IIITians Network has evolved into a nationwide
              ecosystem — enabling collaboration, sharing verified placement
              data, promoting hackathons and competitions, supporting JEE
              aspirants, and showcasing alumni excellence.
              <br />
              <br />
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Connect with us
              </h4>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/iiitians.network"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <Instagram size={18} /> Instagram
                </a>

                <a
                  href="https://www.linkedin.com/company/iiitians-network"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>

                <a
                  href="https://github.com/iiitians-network"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <Github size={18} /> GitHub
                </a>

                <a
                  href="https://twitter.com/iiitiansnetwork"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <Twitter size={18} /> X (Twitter)
                </a>

                <a
                  href="https://iiitians.network"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <Globe size={18} /> Website
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — INITIATIVES */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
            Our Initiatives
          </h2>

          <div className="grid sm:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Link
                key={index}
                to={project.route}
                className="bg-gradient-to-br from-white to-indigo-50
                           rounded-2xl p-8 shadow-lg border border-indigo-100
                           hover:shadow-xl transition-all duration-300
                           transform hover:-translate-y-2"
              >
                <div className="text-indigo-600 mb-4">{project.icon}</div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
