import React, { useState } from "react";
import { Instagram, Linkedin, Globe, MessageCircle } from "lucide-react";

import Initiatives from "./Initiatives";

export default function Index2() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6
          grid grid-cols-1 lg:grid-cols-2
          gap-12 lg:gap-16
          items-start
        "
      >
        {/* LEFT — ABOUT US */}
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-8 text-left lg:text-left">
            About Us
          </h2>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg sm:rounded-3xl p-6 sm:p-10 shadow-lg">
            <p
              className={`
                text-sm sm:text-lg
                text-gray-700
                leading-relaxed
                text-left
                px-1 sm:px-0
                ${expanded ? "" : "line-clamp-4 sm:line-clamp-none"}
              `}
            >
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
            </p>

            {/* READ MORE — MOBILE ONLY */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="sm:hidden mt-2 text-indigo-600 text-sm font-medium hover:underline"
            >
              {expanded ? "Read less" : "Read more"}
            </button>

            {/* SOCIAL LINKS */}
            <div className="mt-6 sm:mt-8">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                Connect with us
              </h4>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Social
                  href="https://www.instagram.com/iiitiansnetwork?igsh=MW4wY2d1Z211aGF2NA=="
                  label="Instagram"
                >
                  <Instagram size={16} />
                </Social>

                <Social
                  href="https://www.linkedin.com/company/iiitians-network/"
                  label="LinkedIn"
                >
                  <Linkedin size={16} />
                </Social>

                <Social
                  href="https://www.reddit.com/r/iiitiansnetwork_/s/raoRbgEdX6"
                  label="Reddit"
                >
                  <Globe size={16} />
                </Social>

                <Social href="https://discord.gg/88AnpuNc6E" label="Discord">
                  <MessageCircle size={16} />
                </Social>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — INITIATIVES (separate component) */}
        <Initiatives />
      </div>
    </section>
  );
}

/* ---------- SOCIAL LINK ---------- */
function Social({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:text-indigo-600 transition"
    >
      {children}
      {label}
    </a>
  );
}
