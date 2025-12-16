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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-screen py-24">

      {/* HEADING */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          JEE Counselling Guidance
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Practical, experience-backed support for JoSAA and CSAB counselling —
          designed to help aspirants make confident, informed choices.
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* LEFT: EXPLANATION */}
        <div className="space-y-5 text-gray-900 leading-relaxed text-md sm:text-base">
          <p>
            IIITians Network simplifies the JEE counselling process by providing
            aspirants with clear, unbiased guidance based on real student
            experiences across IIITs.
          </p>

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

        {/* RIGHT: INTERACTIVE ACCORDION */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
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
                  className="w-full flex justify-between items-center p-4 text-left
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span className="font-medium text-gray-900">
                    {item.title}
                  </span>
                  <span className="text-indigo-600">
                    {active === index ? "−" : "+"}
                  </span>
                </button>

                {active === index && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index4;
