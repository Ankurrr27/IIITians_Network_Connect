import React from "react";
import { useNavigate } from "react-router-dom";
import BigTeamCard from "../../../ui/BigTeamCard";

const Index3 = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Founders
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
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
            name="Founder Name 1"
            role="Co-Founder"
            college="IIIT Kota"
            image="/team/dummypfp.png"
            desc="Played a key role in conceptualizing IIITians Network and laying the foundation for inter-IIIT collaboration."
            links={{
              linkedin: "https://linkedin.com",
              instagram: "https://instagram.com",
            }}
          />

          <BigTeamCard
            name="Founder Name 2"
            role="Co-Founder"
            college="IIIT Guwahati"
            image="/team/dummypfp.png"
            desc="Focused on early platform development, outreach, and building the initial student community."
            links={{
              linkedin: "https://linkedin.com",
              instagram: "https://instagram.com",
            }}
          />

          <BigTeamCard
            name="Founder Name 3"
            role="Co-Founder"
            college="IIIT Gwalior"
            image="/team/dummypfp.png"
            desc="Contributed to strategy, operations, and scaling the initiative across multiple IIIT campuses."
            links={{
              linkedin: "https://linkedin.com",
              instagram: "https://instagram.com",
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default Index3;
