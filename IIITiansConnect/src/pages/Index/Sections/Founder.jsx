import React from "react";
import { useNavigate } from "react-router-dom";
import BigTeamCard from "../../../ui/BigTeamCard";

const Index3 = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              Founders
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl text-sm sm:text-lg">
              The students who initiated IIITians Network to build a unified,
              transparent, and student-first platform for IIITs.
            </p>
          </div>

          <button
            onClick={() => navigate("/team")}
            className="
              text-indigo-600 text-sm font-semibold
              hover:underline underline-offset-4
              self-start sm:self-auto
            "
          >
            View current team →
          </button>
        </div>

        {/* ================= FOUNDERS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <BigTeamCard
            name="Anant Mehra"
            role="Former President and CFO"
            college="IIIT Kota"
            image="/Founders/Anant.png"
            desc="I have witnessed the IIITians Network grow from its inception (January 2020) when it was first initiated, into a platform that has created a significant impact on the IIIT community. At the time, I could not have anticipated the scale and influence it would achieve. What excites me most is seeing new batches join the IIITians Network core team and actively contribute value to this remarkable community. I look forward to the innovative initiatives that will be launched under the leadership of the new generation."
            links={{
              linkedin: "linkedin.com/in/anant-mehra-626952190",
              instagram: "https://www.instagram.com/_.infinity7._?igshid=y3ei9hsdwle7",
            }}
          />

          <BigTeamCard
            name="Shashwat Gupta"
            role="Former COO"
            college="IIIT Gwalior"
            image="/Founders/Shaswat.png"
            desc="IIITians Network began in the first year of college, driven by a long-standing desire to build something meaningful for the community. Taking on the role of COO, the focus was on growth and engagement, helping shape the journey from 0 to 1. Grateful to have met co-founders Anant and Prashant, and deeply thankful for their trust and support. Immensely proud of the juniors who are now carrying the vision forward and taking iiitians Network from 1 to 100. Excited for what lies ahead."
            links={{
              linkedin: "https://www.linkedin.com/in/shashwat-gupta-ab9675179/",
              instagram: "https://www.instagram.com/divisible_by_zero/",
            }}
          />

          <BigTeamCard
            name="Prashant Katiyar"
            role="Former CEO"
            college="IIIT Guwahati"
            image="/team/dummypfp.png"
            desc="Contributed to strategy, operations, and scaling the initiative across multiple IIIT campuses."
            links={{
              linkedin: "https://www.linkedin.com/in/prashant-milan-katiyar/",
              instagram: "https://www.instagram.com/k.prashant__/?hl=en",
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default Index3;
