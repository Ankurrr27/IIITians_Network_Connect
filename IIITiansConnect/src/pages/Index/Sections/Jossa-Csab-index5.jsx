import React, { useState } from "react";

const counsellingPoints = [
  {
    title: "Rank-Based Guidance",
    content:
      "Suggestions aligned with your JEE rank, category, and preferences to help you shortlist realistic institute and branch options.",
  },
  {
    title: "IIIT & Branch Comparison",
    content:
      "Clear comparison of IIITs and branches based on academics, placements, campus life, and long-term opportunities.",
  },
  {
    title: "Student-Led Insights",
    content:
      "First-hand guidance from current IIIT students who have already gone through JoSAA and CSAB counselling.",
  },
];

const Index4 = () => {
  const [active, setActive] = useState(null);
  const [showMore, setShowMore] = useState(false); // 👈 mobile read-more

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ================= HEADING ================= */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            JEE Counselling Guidance
          </h2>

          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Practical, experience-backed support for JoSAA and CSAB counselling —
            designed to help aspirants make confident, informed choices.
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 items-start">

          {/* LEFT: TEXT (READ MORE ON MOBILE) */}
          <div className="text-gray-700 leading-relaxed text-sm sm:text-base space-y-4">

            {/* ALWAYS VISIBLE */}
            <p>
              IIITians Network simplifies the JEE counselling process by providing
              aspirants with clear, unbiased guidance based on real student
              experiences across IIITs.
            </p>

            {/* MOBILE: READ MORE */}
            <div className={`${showMore ? "block" : "hidden"} sm:block space-y-4`}>
              <p>
                We focus on reducing confusion during JoSAA and CSAB rounds by
                explaining institute differences, branch expectations, cutoff
                trends, and placement realities — without exaggeration or false
                promises.
              </p>

              <ul className="list-disc pl-5 space-y-2">
                <li>Institute-wise and branch-wise counselling clarity</li>
                <li>Previous year cutoff trends and interpretation</li>
                <li>Academic workload and placement expectations</li>
                <li>Common mistakes to avoid during choice filling</li>
              </ul>
            </div>

            {/* READ MORE BUTTON — MOBILE ONLY */}
            <button
              onClick={() => setShowMore(!showMore)}
              className="sm:hidden text-indigo-600 text-sm font-medium mt-2"
            >
              {showMore ? "Read less ↑" : "Read more ↓"}
            </button>

            {/* OFFICIAL LINKS — DESKTOP */}
            <div className="hidden sm:block pt-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Official Counselling Portals
              </p>

              <div className="flex gap-4 text-sm">
                <a
                  href="https://josaa.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  JoSAA Official Website →
                </a>

                <a
                  href="https://csab.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  CSAB Official Website →
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: ACCORDION */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 sm:p-8 shadow-md">
            <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-5 sm:mb-6">
              How We Help
            </h3>

            <div className="space-y-3">
              {counsellingPoints.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActive(active === index ? null : index)
                    }
                    className="
                      w-full flex justify-between items-center
                      p-3 sm:p-4 text-left
                      focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-indigo-500
                    "
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-900">
                      {item.title}
                    </span>
                    <span className="text-indigo-600 text-lg">
                      {active === index ? "−" : "+"}
                    </span>
                  </button>

                  {active === index && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600">
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OFFICIAL LINKS — MOBILE (BOTTOM, TAPPABLE) */}
        <div className="sm:hidden mt-10 flex flex-col gap-3">
          <a
            href="https://josaa.nic.in"
            target="_blank"
            rel="noreferrer"
            className="w-full text-center py-2 rounded-lg border border-indigo-600 text-indigo-600 text-sm font-medium"
          >
            JoSAA Official Website
          </a>

          <a
            href="https://csab.nic.in"
            target="_blank"
            rel="noreferrer"
            className="w-full text-center py-2 rounded-lg border border-indigo-600 text-indigo-600 text-sm font-medium"
          >
            CSAB Official Website
          </a>
        </div>
      </div>
    </section>
  );
};

export default Index4;
