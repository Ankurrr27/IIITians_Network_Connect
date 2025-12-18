import React, { useState } from "react";
import MiniTeamCard from "../ui/MiniTeamCard";
import Index3 from "../sub-pages/Presi-VP-Leads-index4";

const founders = [
  {
    name: "Founder One",
    role: "Founder & President",
    image: "/team/dummypfp.png",
    desc: "Founded IIITians Network to connect students across all IIITs and build a unified national-level student ecosystem.",
  },
  {
    name: "Founder Two",
    role: "Co-Founder & Strategy Lead",
    image: "/team/dummypfp.png",
    desc: "Leads long-term vision, partnerships, and strategic growth of the IIITians Network.",
  },
  {
    name: "Founder Three",
    role: "Co-Founder & Operations Lead",
    image: "/team/dummypfp.png",
    desc: "Oversees operations, execution, and coordination across all IIIT chapters.",
  },
];

const Team = () => {
  const [year, setYear] = useState("2025-26");

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HERO ================= */}
        <div className="pt-24 pb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            Our Team
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The people driving collaboration, leadership, and innovation across
            IIITs.
          </p>

          <div className="mt-8 flex justify-center">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="2025-26">2025–26 (Current)</option>
              <option value="2024-25">2024–25</option>
              <option value="2023-24">2023–24</option>
            </select>
          </div>
        </div>

        {/* ================= VISION & MISSION ================= */}
        <div className="grid md:grid-cols-2 gap-14 pb-24">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To build a unified and empowered student community across all
              Indian Institutes of Information Technology, fostering
              collaboration, leadership, and innovation beyond institutional
              boundaries.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Strengthen collaboration among IIIT students nationwide</li>
              <li>Create platforms for leadership, innovation, and outreach</li>
              <li>Bridge students, alumni, and industry</li>
              <li>Represent IIITs collectively at a national level</li>
            </ul>
          </div>
        </div>

        {/* ================= FOUNDERS ================= */}
        <div className="bg-gray-50 rounded-3xl p-10 mb-28">
          <h2 className="text-3xl font-bold mb-14 text-center">Founders</h2>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {founders.map((f, i) => (
              <div
                key={i}
                className="
                  bg-white rounded-2xl border border-gray-200
                  p-6 text-center
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg
                "
              >
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-28 h-28 mx-auto rounded-2xl object-cover border mb-5"
                />

                <h3 className="text-lg font-semibold text-gray-900">
                  {f.name}
                </h3>

                <p className="text-sm font-medium text-indigo-600 mb-3">
                  {f.role}
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CORE TEAM ================= */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-14">
            Core Team {year}
          </h2>
          <Index3 showViewMore={false} />
        </div>

        {/* ================= TEAM MEMBERS ================= */}
        <div className="my-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <MiniTeamCard
              name="Apeksha Yadav"
              team="Design"
              college="IIIT Pune"
              image="/team/apeksha.jpeg"
              instagram="https://github.com/aryanthakur"
              linkedin="https://linkedin.com/in/aryanthakur"
            />

            <MiniTeamCard
              name="Nilesh Sahay"
              team="Content"
              college="IIIT Pune"
              image="/team/nilesh.jpeg"
              instagram="https://github.com/aryanthakur"
              linkedin="https://linkedin.com/in/aryanthakur"
            />

            <MiniTeamCard
              name="Varun"
              team="Social Media"
              college="IIIT Ranchi"
              image="/team/varun.png"
              instagram="https://instagram.com/gauransh"
              linkedin="https://linkedin.com/in/gauransh"
            />

            <MiniTeamCard
              name="Advik"
              team="Design Media"
              college="IIIT Kota"
              image="/team/advik.jpg"
              instagram="https://instagram.com/gauransh"
              linkedin="https://linkedin.com/in/gauransh"
            />


            <MiniTeamCard
              name="Deepak"
              team="Content Media"
              college="IIIT Manipur"
              image="/team/deepak.jpeg"
              instagram="https://instagram.com/gauransh"
              linkedin="https://linkedin.com/in/gauransh"
            />

            <MiniTeamCard
              name="Gauransh Sattavan"
              team="Social Media"
              college="IIIT Kota"
              image="/team/gauransh.jpg"
              instagram="https://instagram.com/gauransh"
              linkedin="https://linkedin.com/in/gauransh"
            />

            <MiniTeamCard
              name="Subhojit"
              team="Design"
              college="IIIT Bhopal"
              image="/team/vibhu.JPG"
              linkedin="https://linkedin.com/in/subhojit"
              instagram="https://behance.net/subhojit"
            />

            <MiniTeamCard
              name="Shikhar"
              team="Social Media"
              college="IIIT Kota"
              image="/team/shikhar.jpg"
              instagram="https://instagram.com/shikhar"
              linkedin="https://linkedin.com/in/shikhar"
            />

            <MiniTeamCard
              name="Rudraksh Gupta"
              team="Social Media"
              college="IIIT Nagpur"
              image="/team/rudra.jpg"
              instagram="https://instagram.com/rudraksh"
              twitter="https://twitter.com/rudraksh"
            />

            <MiniTeamCard
              name="Rishav"
              team="Design"
              college="IIIT Gwalior"
              image="/team/Rishav.jpg"
              instagram="https://behance.net/rishav"
              linkedin="https://linkedin.com/in/rishav"
            />

            <MiniTeamCard
              name="Aryan Thakur"
              team="Tech"
              college="IIIT Guwahati"
              image="/team/aryan.jpeg"
              instagram="https://github.com/aryanthakur"
              linkedin="https://linkedin.com/in/aryanthakur"
            />

            <MiniTeamCard
              name="Yajur"
              team="Social Media"
              college="IIIT Bhopal"
              image="/team/yajur.jpg"
              instagram="https://github.com/aryanthakur"
              linkedin="https://linkedin.com/in/aryanthakur"
            />

            <MiniTeamCard
              name="Sarthak"
              team="Social Media"
              college="IIIT Ranchi"
              image="/team/sarthak.jpeg"
              instagram="https://github.com/aryanthakur"
              linkedin="https://linkedin.com/in/aryanthakur"
            />

            <MiniTeamCard
              name="Sinchan"
              team="Social Media"
              college="IIIT Ranchi"
              image="/team/sinchan.jpeg"
              instagram="https://github.com/aryanthakur"
              linkedin="https://linkedin.com/in/aryanthakur"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
