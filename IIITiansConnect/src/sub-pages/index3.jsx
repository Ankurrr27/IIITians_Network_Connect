import React from "react";
import BigTeamCard from "../ui/BigTeamCard";
import SmallTeamCard from "../ui/SmallTeamCard";
import MiniTeamCard from "../ui/MiniTeamCard";

const index3 = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-12">Our Team</h1>

        {/* PRESIDENT + VP */}
        <div className="grid grid-cols-2 gap-10 mb-14">
          <BigTeamCard
            name="Srishti Singh"
            role="President"
            college="IIIT-Kota"
            image="/Srishti_image.png"
            desc="Leads the IIITians Network by driving strategy, partnerships, and coordination across all IIITs while ensuring long-term sustainability of initiatives."
            links={{
              linkedin: "https://linkedin.com/in/username",
              instagram: "https://instagram.com/username",
              twitter: "https://twitter.com/username",
              website: "https://iiitians.network",
              github: "https://github.com/lokesh",
            }}
          />

          <BigTeamCard
            name="Lokesh"
            role="Vice President"
            college="IIIT-Kalyani"

            image="/lokesh.png"
            desc="Oversees internal operations and coordination across IIITs, ensuring smooth execution of initiatives and effective communication between teams."
            links={{
              linkedin: "https://linkedin.com/in/lokesh",
              instagram: "https://instagram.com/lokesh",
              twitter: "https://twitter.com/lokesh",
              github: "https://github.com/lokesh",
            }}
          />
        </div>

        {/* LEADS */}

        <div className="grid grid-cols-3 gap-6 mb-12">
          <SmallTeamCard
            name="Ankur Singh"
            role="Social Media Lead"
            college="IIIT-Kota"

            image="/team/ankur.jpg"
            desc="Manages social media strategy, content planning, and outreach to strengthen the IIITians Network presence across platforms."
            links={{
              linkedin: "https://linkedin.com/in/ankur",
              instagram: "https://instagram.com/ankur",
              twitter: "https://twitter.com/ankur",
              github: "https://github.com/rahul",
            }}
          />

          <SmallTeamCard
            name="Mahak Gupta"
            role="Content Team"
            college="IIIT-Kota"

            image="/team/dummypfp.png"
            desc="Researches topics relevant to IIIT students, prepares informative articles and announcements, and ensures all published content is accurate, structured, and student-focused."
            links={{
              linkedin: "https://linkedin.com/in/ankur",
              instagram: "https://instagram.com/ankur",
              twitter: "https://twitter.com/ankur",
              github: "https://github.com/rahul",
            }}
          />

          <SmallTeamCard
            name="Sankalp Joshi"
            role="Design Team"
            college="IIIT-Allahabad"

            image="/team/dummypfp.png"
            desc="Responsible for visual design, branding assets, and ensuring a clean, user-friendly interface."
            links={{
              linkedin: "https://linkedin.com/in/ankur",
              instagram: "https://instagram.com/ankur",
              twitter: "https://twitter.com/ankur",
              github: "https://github.com/rahul",
            }}
          />
        </div>

        {/* MEMBERS */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <MiniTeamCard
              name="Aman Gupta"
              team="Content"
              college="IIIT Kota"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Neha Sharma"
              team="Design"
              college="IIIT Gwalior"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Rahul Verma"
              team="Tech"
              college="IIIT Guwahati"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Priya Singh"
              team="Social"
              college="IIIT Pune"
              image="/team/dummypfp.png"
            />
              <MiniTeamCard
              name="Aman Gupta"
              team="Content"
              college="IIIT Kota"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Neha Sharma"
              team="Design"
              college="IIIT Gwalior"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Rahul Verma"
              team="Tech"
              college="IIIT Guwahati"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Priya Singh"
              team="Social"
              college="IIIT Pune"
              image="/team/dummypfp.png"
            />
              <MiniTeamCard
              name="Aman Gupta"
              team="Content"
              college="IIIT Kota"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Neha Sharma"
              team="Design"
              college="IIIT Gwalior"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Rahul Verma"
              team="Tech"
              college="IIIT Guwahati"
              image="/team/dummypfp.png"
            />

            <MiniTeamCard
              name="Priya Singh"
              team="Social"
              college="IIIT Pune"
              image="/team/dummypfp.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default index3;
